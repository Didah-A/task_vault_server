import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface IUser {
  name: string;
  email: string;
  password: string;
  generateToken?: (user: any) => string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateToken = function (user: IUserModel) {
  const token = jwt.sign(
    { _id: user.id, email: user.email, name: user.name },
    config.auth.key || ""
  );
  return token;
};

export default mongoose.model<IUserModel>("User", UserSchema);
