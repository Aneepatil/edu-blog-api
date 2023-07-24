import express from "express";
import multer from "multer";
import {
  createPost,
  deletePost,
  fetchAllPosts,
  postDetail,
  toggleDisLikePost,
  toggleLikePost,
  updatePost,
} from "../../controllers/posts/postController.js";
import { isLogin } from "./../../middlewares/isLogin.js";
import { storage } from './../../config/cloudinary.js';

const route = express.Router();

// File upload middleware

const upload = multer({ storage })

// POST//api/v1/posts
// Create Post Route
route.post("/", isLogin, upload.single('image'), createPost);

// GET/api/v1/posts
// Get All Post Route
route.get("/", isLogin, fetchAllPosts);

// GET/api/v1/posts/likes/:id
// Toggle Like Post Route
route.get("/likes/:id", isLogin, toggleLikePost);

// GET/api/v1/posts/dis-like/:id
// Toggle Iis-Like Post Route
route.get("/dis-like/:id", isLogin, toggleDisLikePost);

// GET/api/v1/posts/:id
// Get Post Detail Route
route.get("/:id",isLogin, postDetail);

// PUT/api/v1/posts/:id
// Update Post Route
route.put("/:id",isLogin, upload.single('image'), updatePost);

// DELETE/api/v1/posts/:id
// Delete Post Route
route.delete("/:id",isLogin, deletePost);

export default route;
