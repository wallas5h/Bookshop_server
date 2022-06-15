import bcrypt from "bcrypt";
import { Request, Response } from "express";
import "express-async-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import process from "process";
import { User } from "../models";
import { UserEntity } from "../types";

import { ValidationError } from "../utils/errors";

export interface tokenEntity extends JwtPayload {
  id: string;
}

// @desc register new user
// @route post /api/users
// @acces Public
export const registerUser = async (req: Request, res: Response) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res
      .status(400)
    throw new ValidationError('Please add all fields');
  }

  // Check if user exists

  const userExist = await User.findOne({ email });

  if (userExist) {
    res
      .status(400)
    throw new ValidationError('User already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user: UserEntity = await User.create({
    name,
    email,
    password: hashedPassword,
    token: ""
  })


  if (user) {

    // create token and update user
    const token = generateToken(user._id);

    user.token = token;

    await User.findByIdAndUpdate({ _id: user._id }, user)

    res
      .status(201)
      .json({
        _id: user._id,
        email: user.email,
        token,
      })
  } else {
    res
      .status(400)
    throw new ValidationError('Invalid user data');
  }

}

// @desc Authenticate a user
// @route post /api/users/login
// @acces Public
export const loginUser = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  // Check for user email
  const user: UserEntity = await User.findOne({ email });
  const token = user.token;

  if (user && bcrypt.compare(password, user.password)) {
    res
      .status(200)
      .cookie('jwt', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        secure: true,
      })
      .json({
        _id: user._id,
        email: user.email,
        token,
      })
  } else {
    res
      .status(400)
    throw new ValidationError('Invalid credentials');
  }

}


// @desc get user data
// @route get /api/users/me
// @acces Private
export const getMe = async (req: any, res: Response) => {

  let jwtCookie: string | undefined = req.cookies.jwt;

  const { _id, email } = await User.findById(req.user.id);


  if (jwtCookie && verifyToken(jwtCookie) === _id) {

    res
      .status(200)
      .json({
        id: _id,
        email
      })
  }
  else {
    res
      .status(400)
    throw new ValidationError('Invalid credentials');
  }

}

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '30d'
  })
}

// verify JWT
const verifyToken = (jwtCookie) => {
  let encryptToken = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_KEY) as tokenEntity;
  const id = encryptToken.id;
  if (!id) {
    return null
  }
  return id
}