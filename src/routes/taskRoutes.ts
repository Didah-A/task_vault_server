import express from "express";
import authenticate from "../middleware/auth";
import TaskController from "../controllers/tasks";

const router = express.Router();

router.get("/:taskId", authenticate, TaskController.getTask);
router.post("/", authenticate, TaskController.createTask);
router.get("/", authenticate, TaskController.getAllTasks);
router.patch("/:taskId", authenticate, TaskController.updateTask);
router.delete("/:taskId", authenticate, TaskController.deleteTask);

export default router;
