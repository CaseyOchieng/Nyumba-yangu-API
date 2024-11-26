import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
// constants and variables
const port = 3000;
const Mongoclient = process.env.MONGODB_URI;
const app = express();
// middlewares.
app.use(express.json());
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
});
//  routes
app.use("/api/auth", authRoutes);
//App listening to port.
app.listen(port, () => {
  mongoose
    .connect(Mongoclient)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log(`Server is running on http://localhost:${port}`);
});
