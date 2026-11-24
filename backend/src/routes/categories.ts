import express, { Request, Response } from "express";

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

export default router;
