import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config();
// constants and variables
const port = 3000;
const Mongoclient = process.env.MONGODB_URI;
const app = express();
//  routes

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
