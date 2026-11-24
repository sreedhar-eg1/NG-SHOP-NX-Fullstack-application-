import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { User } from "../models/user.js";

const router = express.Router();

// GET all users (without passwordHash)
router.get("/", async (req: Request, res: Response) => {
  const userList = await User.find().select("-passwordHash"); // - indicate to exclude this field
  return res.status(200).json(userList);
});

// GET single user
router.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json(user);
});

export default router;
