import bcrypt from "bcrypt";
import { Request, Response } from "express";
import "express-async-errors";
import { config } from "../config/config";
import { User } from "../models";
import { UserEntity } from "../types";

import { ValidationError } from "../utils/errors";
import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../utils/logs";
import { sendMail } from "../utils/mailer";
import { EmailSubject, EmailView } from "../utils/mailer.utils";

// @desc register new user
// @route post /api/users
// @acces Public
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, terms } = req.body;

  if (!name || !email || !password || !terms) {
    res.status(400);
    throw new ValidationError("Please add all fields");
  }

  // Check if user exists

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400).json({
      message: "User already exists",
    });
    throw new ValidationError("User already exists");
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
    token: "",
    refreshToken: "",
    confirmed: false,
  });

  if (user) {
    // create token and update user
    const token = generateRefreshToken(user._id);

    user.refreshToken = token;

    await user.save();

    const confirmedLink = `${config.domainAddress}/users/confirm/${user._id}`;

    sendMail(email, EmailSubject.register, EmailView.register, confirmedLink);

    res.status(200).json({
      email: user.email,
      message: "Check your email to activate your account.",
    });
  } else {
    res.status(400).json({
      message: "Invalid user data",
    });
    throw new ValidationError("Invalid user data");
  }
};

// @desc Confirming a registration
// @route post /api/users/confirm/:id
// @acces Public

export const confirmRegistration = async (req, res) => {
  const userId = String(req.params.id);

  if (!userId) {
    res.status(400).send("Error: Invalid id");
    return;
  }

  const newUser = await User.findOne({
    _id: userId,
  });

  if (!newUser) {
    res.status(400).send("Error: Invalid id");
    return;
  }

  newUser.confirmed = true;
  await newUser.save();

  res.status(200).send("Thank you for confirming your account. ");
};

export const resendRegisterVerification = async (req, res) => {
  const email = String(req.body.email);

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send("Error: Invalid credencials");
    return;
  }

  const confirmedLink = `${config.domainAddress}/users/confirm/${user._id}`;

  sendMail(email, EmailSubject.register, EmailView.register, confirmedLink);

  res.status(200).json({
    message: "Check your email, we send you activation link.",
  });
};

// @desc Authenticate a user
// @route post /api/users/login
// @acces Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      warning: "Invalid email or password",
    });
    return;
  }

  const token = generateToken(user._id);
  user.token = token;
  await user.save();

  const passMatch = await bcrypt.compare(password, user.password);

  if (user && passMatch) {
    if (!user.confirmed) {
      res.status(401).json({
        warning: "This account is not confirmed",
        resendVerificationLink: true,
      });
      return;
    }

    res
      .status(200)
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        secure: true,
      })
      .json({
        name: user.name,
        email: user.email,
        message: "Login successfully",
      });
  } else {
    res.status(400).json({
      warning: "Invalid email or password",
    });
    return;
  }
};

// @desc Logout user
// @route get /api/users/logout
// @acces Public
export const logoutUser = async (req: Request, res: Response) => {
  const jwtCookie: string | undefined = req.cookies.jwt;
  const userId = verifyToken(jwtCookie);

  if (!userId) {
    res.status(400);
    throw new ValidationError("Invalid credentials");
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    res.status(400);
    throw new ValidationError("Invalid credentials");
  }

  user.token = "";
  await user.save();

  res.status(200).clearCookie("jwt").json({
    message: "You have been successfully logged out",
  });
};

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
    res.status(400);
    throw new ValidationError("Invalid credentials");
  }

  res.status(200).json({
    email: user.email,
  });
};
