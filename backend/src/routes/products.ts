import express, { Request, Response } from "express";
import multer from "multer";
import { Product } from "../models/product.js";
import mongoose from "mongoose";

const router = express.Router();

const FILE_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination(_req, file, callback) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    const uploadError = isValid ? null : new Error("Invalid image type"); // If it returns null proceed with upload others wise pass it to the error handler middleware
    callback(uploadError, "public/uploads"); // This folder should be present, multer will not create it automatically
  },
  filename(_req, file, callback) {
    const filename = file.originalname.split(" ").join("-").split(".")[0];
    const extension = FILE_TYPE_MAP[file.mimetype];
    callback(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage });

// GET all products (supports ?categories=id1,id2 filter)
router.get("/", async (req: Request, res: Response) => {
  try {
    let filter: Record<string, unknown> = {};

    if (req.query.categories && typeof req.query.categories === "string") {
      filter = { category: { $in: req.query.categories.split(",") } };
    }

    const productList = await Product.find(filter).populate("category");
    return res.status(200).json(productList);
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

// GET single product
router.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json(product);
});

export default router;
