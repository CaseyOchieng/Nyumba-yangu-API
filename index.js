import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

// load environment variables
dotenv.config();
// constants and variables
const port = 3000;
const Mongoclient = process.env.MONGODB_URI;
const app = express();

// middlewares.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
//  routes.
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

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
