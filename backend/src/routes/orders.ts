import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Order } from "../models/order.js";
import { OrderItem } from "../models/order-item.js";
import { Product } from "../models/product.js";

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

// POST create order & calculate totalPrice securely on backend
router.post("/", async (req: Request, res: Response) => {
  try {
    let itemsInput: OrderItemInput[] = req.body.orderItems;

    const orderItemIds = await Promise.all(
      itemsInput.map(async (item) => {
        let newOrderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem.id;
      }),
    );

    const itemPrices = await Promise.all(
      itemsInput.map(async (item) => {
        let product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }

        return product.price * item.quantity;
      }),
    );

    const totalPrice = itemPrices.reduce((acc, price) => acc + price, 0);

    let order = new Order({
      orderItems: orderItemIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status || "Pending",
      totalPrice,
      user: req.body.user,
    });

    order = await order.save();
    return res.status(201).json(order);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Order could not be created", error });
  }
});

// PUT update order status (Admin)
router.put("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true },
  );
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json(order);
});

// DELETE order & clean up orphaned OrderItems
router.delete("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  await Promise.all(
    order.orderItems.map((orderItemId) => Order.findByIdAndDelete(orderItemId)),
  );

  return res.status(200).json({ success: true, message: "Order deleted" });
});

// GET total sales revenue (Admin Dashboard)
router.get("/get/totalsales", async (_req: Request, res: Response) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales.length) {
    return res.status(200).json({ totalsales: 0 });
  }

  return res.status(200).json({ totalsales: totalSales[0].totalsales });
});

// GET total order count (Admin Dashboard)
router.get("/get/count", async (_req: Request, res: Response) => {
  const orderCount = await Order.countDocuments();
  return res.status(200).json({ orderCount });
});

// GET order history for a specific user
router.get("/get/userorders/:userid", async (req: Request, res: Response) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItem",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  return res.status(200).json(userOrderList);
});

export default router;
