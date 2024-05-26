import express from "express";
import userController from "../controllers/user";

const router = express.Router();

router.post("/create", userController.createUser);
router.get("/:userId", userController.getUser);
router.patch("/:userId", userController.updateUser);
router.get("/", userController.getAllUsers);
router.delete("/:userId", userController.deleteUser);

export = router;
