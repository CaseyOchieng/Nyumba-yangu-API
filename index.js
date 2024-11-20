import express from "express";
import mongoose from "mongoose";

const port = 3000;

const app = express();

mongoose.connect("mongodb://localhost:27017/mern-estate");
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
