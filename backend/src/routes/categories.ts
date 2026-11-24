import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Category } from "../models/category.js";

const router = express.Router();

// GET all categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categoryList = await Category.find();
    return res.status(200).json(categoryList);
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

// GET single category by ID
router.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Category ID" });
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
});

// POST create category (Admin only via JWT middleware)
router.post("/", async (req: Request, res: Response) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    return res.status(201).json(category);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Category could not be created", error });
  }
});

export default router;
