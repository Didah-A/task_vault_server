import { Request, Response } from "express";
import { pick } from "lodash";
import Task from "../models/tasks";
import { createTaskValidation } from "../validation/taskValidation";
import getUser from "../utils/getUser";

const createTask = async (request: Request, response: Response) => {
  const newTask = pick(request.body, ["title", "description"]);
  const { error } = createTaskValidation.validate(newTask);
  const user = getUser(request);

  if (error) {
    return response.status(400).json({ message: error.details[0].message });
  }

  try {
    const task = await Task.create({ owner: user?._id, ...newTask });
    return response.status(201).json(task);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong", error });
  }
};

const getTask = async (request: Request, response: Response) => {
  const taskId = request.params.taskId;
  const user = getUser(request);

  try {
    const task = await Task.findOne({ _id: taskId, owner: user._id }).populate(
      "owner",
      "_id name email"
    );
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.status(200).json(task);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong", error });
  }
};

const getAllTasks = async (request: Request, response: Response) => {
  const user = getUser(request);
  try {
    const tasks = await Task.find({
      owner: user._id,
    }).populate("owner", "_id name email");
    return response.status(200).json(tasks);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong fetching tasks", error });
  }
};

const updateTask = async (request: Request, response: Response) => {
  const taskId = request.params.taskId;
  const taskBody = pick(request.body, ["title", "description"]);
  const user = getUser(request);

  const { error } = createTaskValidation.validate(taskBody);

  if (error) {
    return response.status(400).json({ message: error.details[0].message });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      { _id: taskId, owner: user._id },
      {
        $set: {
          title: taskBody.title,
          description: taskBody.description,
        },
      },
      { new: true }
    );
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.status(200).json(task);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something went wrong fetching tasks", error });
  }
};

const deleteTask = async (request: Request, response: Response) => {
  const taskId = request.params.taskId;
  const user = getUser(request);

  try {
    const task = await Task.findByIdAndDelete({ _id: taskId, owner: user._id });
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.status(200).json({ message: "success" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "something deleting task", error });
  }
};

export default { createTask, getTask, getAllTasks, updateTask, deleteTask };
