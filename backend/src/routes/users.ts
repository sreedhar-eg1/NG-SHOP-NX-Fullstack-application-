import express, { Request, Response } from "express";

import { User } from "../models/user.js";

const router = express.Router();

// GET all users (without passwordHash)
router.get("/", async (req: Request, res: Response) => {
  const userList = await User.find().select("-passwordHash"); // - indicate to exclude this field
  return res.status(200).json(userList);
});

export default router;
