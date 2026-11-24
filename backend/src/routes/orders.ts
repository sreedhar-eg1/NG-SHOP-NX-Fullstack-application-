import express, { Request, Response } from "express";

import { Order } from "../models/order.js";

const router = express.Router();

interface OrderItemInput {
  quantity: number;
  product: string;
}

// GET all orders sorted newest first
router.get("/", async (req: Request, res: Response) => {
  const order = await Order.find()
    .populate("user", "name email")
    .sort({ dateOrdered: -1 });

  return res.status(200).json(orderList);
});

export default router;
