import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
    };

    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};