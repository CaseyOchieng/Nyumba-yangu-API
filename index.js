import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const port = 3000;
const Mongoclient = process.env.MONGODB_URI;

const app = express();

app.listen(port, () => {
  mongoose.connect(Mongoclient).then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`Server is running on http://localhost:${port}`);
});
