import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { pick } from "lodash";
import User from "../models/user";
import getCurrentUser from "../utils/getUser";
import {
  createUserValidation,
  signinValidation,
} from "../validation/userValidation";

const createUser = async (request: Request, response: Response) => {
  const newUser = pick(request.body, ["name", "email", "password"]);
  const { error } = createUserValidation.validate(newUser);

  if (error) {
    return response.status(400).json({ error: error.details[0].message });
  }

  try {
    const userExists = await User.findOne({ email: newUser.email });

    if (userExists) {
      return response.status(400).json({ message: "Email already exists" });
    }

    /** Hashing password */
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;

    const user = await User.create(newUser);
    return response.status(201).json(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong creating a user", error });
  }
};

const getUser = async (request: Request, response: Response) => {
  const userId = request.params.userId;
  const loggedInUser = getCurrentUser(request);

  if (userId !== loggedInUser._id) {
    return response.status(403).json({ message: "Forbidden" });
  }

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

const getAllUsers = async (_request: Request, response: Response) => {
  try {
    const users = await User.find().select("_id name email");
    return response.status(200).json(users);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong fetching all users", error });
  }
};

const updateUser = async (request: Request, response: Response) => {
  const userId = request.params.userId;
  const userInfo = pick(request.body, ["name"]);
  const loggedInUser = getCurrentUser(request);

  if (userId !== loggedInUser._id) {
    return response.status(403).json({ message: "Forbidden" });
  }

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

const deleteUser = async (request: Request, response: Response) => {
  const userId = request.params.userId;
  const loggedInUser = getCurrentUser(request);

  if (userId !== loggedInUser._id) {
    return response.status(403).json({ message: "Forbidden" });
  }

  try {
    await User.findByIdAndDelete(userId);

    return response.status(204).json({ message: "success" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Something went wrong", error });
  }
};

const signin = async (request: Request, response: Response) => {
  const userInfo = pick(request.body, ["email", "password"]);
  const { error } = signinValidation.validate(userInfo);

  if (error) {
    return response.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(
      userInfo.password,
      user.password
    );

    if (!passwordMatch) {
      return response
        .status(401)
        .json({ message: "invalid email or password" });
    }
    const token = user.generateToken?.(user) || "";

    return response
      .header("x-auth-token", token)
      .send(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    response.status(500).json({ message: "Something went wrong!" });
  }
};

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  signin,
};
