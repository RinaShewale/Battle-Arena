import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import config from "../config/config.js";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      config.JWT_SECRET
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};