import { NextFunction, Request, Response } from "express";
import process from "process";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500 ? "Sorry, please try again later." : err.message,
      stack: process.env.NODE_ENV === ' production' ? null : err.stack
    })
}