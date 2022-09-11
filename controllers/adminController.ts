import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Admin } from "../models/adminModel";

export interface tokenEntity extends JwtPayload {
  id: string;
}

// @desc get admin
// @route get /api/admin/check-access
// @acces Pivate

export const checkAccess = async (req: any, res: Response) => {
  if (req.admin) {
    return res.status(200);
  } else {
    return res.status(403);
  }
};

// @desc post admin
// @route post /api/admin/login
// @acces Pivate

export const adminLogin = async (req: Request, res: Response) => {
  const name = String(req.body.name);
  const password = String(req.body.password);

  if (!name || !password) {
    return res.status(400).json({
      warning: "Invalid name or password",
    });
  }

  const admin = await Admin.findOne({
    name,
  });

  if (!admin) {
    return res.status(400).json({
      warning: "Invalid name or password",
    });
  }

  const passMatch = await bcrypt.compare(password, admin.password);

  if (!passMatch) {
    return res.status(400).json({
      warning: "Invalid name or password",
    });
  }

  const refreshTokenSalt = await bcrypt.genSalt(10);
  const accessTokenSalt = await bcrypt.genSalt(10);

  admin.refreshTokenSalt = refreshTokenSalt;
  admin.accessTokenSalt = accessTokenSalt;

  const id = admin._id;
  const accessToken = jwt.sign({ id }, accessTokenSalt, {
    expiresIn: "15min",
  });
  const refreshToken = jwt.sign({ id }, refreshTokenSalt);

  admin.refreshToken = refreshToken;
  admin.accessToken = accessToken;
  await admin.save();

  res.status(200).json({
    accessToken,
    refreshToken,
  });
};

// @desc post admin
// @route post /api/admin/create
// @acces Pivate

export const createAdmin = async (req: Request, res: Response) => {
  const name = String(req.body.name);
  const password = String(req.body.password);

  if (!name || !password) {
    return res.status(400).json({
      message: "Invalid name or password",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = await Admin.create({
    name: name,
    password: hashedPassword,
  });

  if (!newAdmin) {
    return res.status(500).json({
      warning: "Server error",
    });
  }

  return res.status(200).json({
    message: "Admin created",
  });
};

// @desc delete admin
// @route post /api/admin/logout
// @acces Pivate

export const adminLogout = async (req: any, res: Response) => {
  const accessToken = String(req.body.accessToken);

  const admin = await Admin.findOne({
    _id: req.admin.id,
  });

  if (!admin) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  admin.refreshTokenSalt = "";
  admin.accessTokenSalt = "";

  admin.refreshToken = "";
  admin.accessToken = "";
  await admin.save();

  return res.status(200).json({
    message: "Logout successfully",
  });
};

// @desc put admin
// @route post /api/admin/refresh-token
// @acces Pivate

export const refreshAdminToken = async (req: any, res: Response) => {
  const id = req.admin.id;
  const refreshToken = String(req.body.refreshToken);

  console.log("Działa refresh token");

  const admin = await Admin.findOne({
    _id: id,
    refreshToken,
  });

  if (!admin) {
    return res.status(403).json({
      message: "Not authorized",
    });
  }

  const accessTokenSalt = await bcrypt.genSalt(10);

  const accessToken = jwt.sign({ id }, accessTokenSalt, {
    expiresIn: "15min",
  });

  admin.accessTokenSalt = accessTokenSalt;
  admin.accessToken = accessToken;

  await admin.save();

  res.status(200).json({
    accessToken,
  });
};
