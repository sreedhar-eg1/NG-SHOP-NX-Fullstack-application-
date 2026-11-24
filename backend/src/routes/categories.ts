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

// PUT update category
router.put("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Category ID" });
  }

  let category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }, // return the updated document instead of old one
  );

  if (!category) {
    return res.status(400).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
});

// DELETE category
router.delete("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Category ID" });
  }

  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

export default router;
