import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

// POST login & return JWT
router.post("/login", async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET as string;

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      user: user.email,
      userId: user.id,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
});

// PUT update user (Admin or Profile)
router.put("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res.status(400).json({ message: "User not found" });
  }

  const newPassword = req.body.password
    ? bcrypt.hashSync(req.body.password, 10)
    : userExist.passwordHash;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true },
  ).select("-passwordHash");

  return res.status(200).json(user);
});

export default router;
