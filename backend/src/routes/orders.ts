import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Order } from "../models/order.js";
import { populate } from "dotenv";

const router = express.Router();

interface OrderItemInput {
  quantity: number;
  product: string;
}

// GET all orders sorted newest first
router.get("/", async (req: Request, res: Response) => {
  const orderList = await Order.find()
    .populate("user", "name email")
    .sort({ dateOrdered: -1 });

  return res.status(200).json(orderList);
});

// GET single order with nested product & category details
router.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "OrderItem",
      populate: { path: "product", populate: "category" },
    });

  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.status(200).json(order);
});

export default router;
