import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { dbConnect } from "./config/dbConnect.js";
import userRoute from "./routes/users/userRoute.js";
import postRoute from "./routes/posts/postRoute.js";
import commentRoute from "./routes/comments/commentRoute.js";
import categoryRoute from "./routes/categories/categoryRoute.js";
import { globleErrorHandler } from "./middlewares/globleErrorHandler.js";
import { isAdmin } from "./middlewares/isAdmin.js";

dotenv.config();

const app = express();

// Call the dbConnect function to establish the database connection
dbConnect();

// Set up middlewares
app.use(express.json());
app.use(cors());
// app.use(isAdmin)

// Define routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/categories", categoryRoute);

// Define error handler middleware
app.use(globleErrorHandler);

// Page Not found Error(404) handler middleware
app.use("*", (req,res) => {
  res.status(404).json({
    message: `${req.originalUrl} -> Route Not Found`,
  });
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}....`);
});
