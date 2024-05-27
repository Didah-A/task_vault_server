import express from "express";
import userController from "../controllers/user";
import authenticate from "../middleware/auth";

const router = express.Router();

/** Public routes */
router.post("/create", userController.createUser);
router.post("/signin", userController.signin);

/** Private routes */
router.get("/:userId", authenticate, userController.getUser);
router.patch("/:userId", authenticate, userController.updateUser);
router.get("/", authenticate, userController.getAllUsers);
router.delete("/:userId", authenticate, userController.deleteUser);

export default router;
