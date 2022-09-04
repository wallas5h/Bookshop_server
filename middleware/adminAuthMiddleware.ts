import { NextFunction, Response } from "express";
import "express-async-errors";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel";

type decodedEntity = {
  id: string;
  iat: number;
  exp: number;
};

export const adminAuthMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      accessToken = req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }

      const admin = await Admin.findOne({
        accessToken: accessToken,
      });

      const accessTokenSalt = admin.accessTokenSalt;

      // Verify token
      const decoded = jwt.verify(accessToken, accessTokenSalt) as decodedEntity;

      if (decoded.id === admin._id.toString()) {
        req.admin = admin;
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!accessToken) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
