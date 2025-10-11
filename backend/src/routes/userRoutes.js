import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);       // CREATE
router.get("/", getUsers);          // READ
router.put("/:id", updateUser);     // UPDATE
router.delete("/:id", deleteUser);  // DELETE

export default router;