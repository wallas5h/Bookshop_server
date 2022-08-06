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

  const { name, email, password, terms } = req.body;

  if (!name || !email || !password || !terms) {
    res
      .status(400)
    throw new ValidationError('Please add all fields');
  }

  // Check if user exists

  const userExist = await User.findOne({ email });

  if (userExist) {
    res
      .status(400)
      .json({
        message: 'User already exists'
      })
    throw new ValidationError('User already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await new User({
    name,
    email,
    password: hashedPassword,
    terms,
    token: ""
  })


  if (user) {

    // create token and update user
    const token = generateToken(user._id);

    user.token = token;

    await user.save()

    res
      .status(201)
      .json({
        _id: user._id,
        email: user.email,
        message: 'Register user succesfull'
      })
  } else {
    res
      .status(400)
      .json({
        message: 'Invalid user data'
      })
    throw new ValidationError('Invalid user data');
  }

}

// @desc Authenticate a user
// @route post /api/users/login
// @acces Public
export const loginUser = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  const token = generateToken(user._id);
  user.token = token;
  await user.save()

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
        name: user.name,
        email: user.email,
        message: 'Login successfully'
      })
  } else {
    res
      .status(400)
      .json({
        message: 'Invalid credentials'
      })
    throw new ValidationError('Invalid credentials');
  }

}

// @desc Logout user
// @route get /api/users/logout
// @acces Public
export const logoutUser = async (req: Request, res: Response) => {

  const jwtCookie: string | undefined = req.cookies.jwt;
  const userId = verifyToken(jwtCookie);

  if (!userId) {
    res
      .status(400)
    throw new ValidationError('Invalid credentials');
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    res
      .status(400)
    throw new ValidationError('Invalid credentials');
  }

  user.token = null;
  await user.save();

  res
    .status(200)
    .clearCookie('jwt')
    .json({
      message: 'You have been successfully logged out'
    })


}




// @desc get user data
// @route get /api/users/me
// @acces Private
export const getMe = async (req: Request, res: Response) => {

  let user: UserEntity;
  const jwtCookie: string | undefined = req.cookies.jwt;

  if (jwtCookie) {
    const userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  if (!user) {
    res
      .status(400)
    throw new ValidationError('Invalid credentials');
  }

  res
    .status(200)
    .json({
      id: user._id,
      email: user.email
    })
}


// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '30d'
  })
}

// verify JWT
export const verifyToken = (jwtCookie) => {
  let encryptToken = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_KEY) as tokenEntity;
  const id = encryptToken.id;
  if (!id) {
    return null
  }
  return id
}