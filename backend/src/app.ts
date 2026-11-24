import express from "express";
import morgon from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import { authJwt } from "./helpers/jwt.js";
import { errorHandler } from "./helpers/error-handler.js";
import categoriesRoute from "./routes/categories.js";
import productsRoutes from "./routes/products.js";
import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const api = process.env.API_URL || "/api/v1";

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgon("tiny"));
app.use(authJwt());
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "../public/uploads")),
);

// Routes
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Global Error Handler
app.use(errorHandler);

// Database & Server Start
const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error("CONNECTION_STRING is missing in .env");
}

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB Connection Ready");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}${api}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
