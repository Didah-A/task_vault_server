import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { pick } from "lodash";

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const newUser = pick(request.body, ["name", "email"]);
  try {
    const user = await User.create(newUser);
    return response.status(201).json(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong creating a user", error });
  }
};

const getUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    return response.status(500).json({ message: "Error fetching user", error });
  }
};

const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("_id name email");
    return response.status(200).json(users);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong fetching all users", error });
  }
};

const updateUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  const userInfo = pick(request.body, ["name"]);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userInfo.name,
        },
      },
      {
        new: true,
      }
    ).select("_id email name");

    if (!updatedUser) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json(updatedUser);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Something went wrong", error });
  }
};

const deleteUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.userId;
  try {
    await User.findByIdAndDelete(userId);

    return response.status(204).json({ message: "success" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Something went wrong", error });
  }
};

export default { createUser, getUser, getAllUsers, updateUser, deleteUser };
