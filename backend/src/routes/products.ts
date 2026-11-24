import express, { Request, Response } from "express";
import multer from "multer";
import mongoose from "mongoose";

import { Product } from "../models/product.js";
import { Category } from "../models/category.js";

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

// POST create product with main image
router.post(
  "/",
  uploadOptions.single("image"),
  async (req: Request, res: Response) => {
    try {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: "Invalid Category" });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No image in the request" });
      }

      const basePath = `${req.protocol}://${req.get("host")}/public/uploads`; //http://localhost:3000/public/uploads/phone-1732422660123.jpeg

      let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}/${file.fieldname}`,
        brand: req.body.brand,
        price: Number(req.body.price),
        category: req.body.category,
        countInStock: Number(req.body.countInStock),
        rating: Number(req.body.rating || 0),
        numReviews: Number(req.body.numReviews || 0),
        isFeatured:
          req.body.isFeatured === "true" || req.body.isFeatured === true,
      });

      product = await product.save();
      return res.status(201).json(product);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Product could not be created", error });
    }
  },
);

// PUT update product
router.put(
  "/:id",
  uploadOptions.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      }

      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: "Invalid Category" });
      }

      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(400).json({ message: "Product not found" });
      }

      const file = req.file;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      const imagePath = file
        ? `${basePath}/${file.filename}`
        : existingProduct.image;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: imagePath,
          brand: req.body.brand,
          price: Number(req.body.price),
          category: req.body.category,
          countInStock: Number(req.body.countInStock),
          rating: Number(req.body.rating || 0),
          numReviews: Number(req.body.numReviews || 0),
          isFeatured:
            req.body.isFeatured === "true" || req.body.isFeatured === true,
        },
        { new: true },
      );

      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Product could not be updated", error });
    }
  },
);

export default router;
