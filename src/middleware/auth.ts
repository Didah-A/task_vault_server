import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import User, { IUserModel } from "../models/user";

export interface AuthRequest extends Request {
  user: JwtPayload | string | any;
}

export default async function authenticate(
  request: any,
  response: Response,
  next: NextFunction
) {
  const token = request.header("x-auth-token");

  if (!token) {
    return response
      .status(401)
      .json({ message: "Access denied. No Token provided" });
  }

  try {
    const decodedUser: any = jwt.verify(token, config.auth.key!);

    const user = await User.findById(decodedUser._id);
    if (!user) {
      return response.status(404).json({ message: "Invalid Token" });
    }
    request.user = decodedUser;
    next();
  } catch (error) {
    return response.status(400).json({ message: "Invalid Token" });
  }
}
