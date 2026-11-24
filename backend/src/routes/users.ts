import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

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

// POST register customer
router.post("/register", async (req: Request, res: Response) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin || false,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    user = await user.save();
    const userObj = user.toJSON();
    delete (userObj as { passwordHash?: string }).passwordHash;
    return res.status(201).json(userObj);
  } catch (error) {
    return res.status(400).json({ message: "User registration failed", error });
  }
});

export default router;
