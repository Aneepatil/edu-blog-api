import Post from "../../models/PostMod/PostModel.js";
import User from "../../models/UserMod/UserModel.js";
import { appError } from "../../utils/appError.js";
import Comment from "./../../models/CommentMod/CommentModel.js";

export const createComment = async (req, res, next) => {
  const { description } = req.body;

  try {
    // Find the Post
    const post = await Post.findById(req.params.id);

    // Create a Comment
    const comment = await Comment.create({
      post: post._id,
      description,
      user: req.userAuth,
    });

    // Push the comment to the post
    post.comments.push(comment._id);

    // Find the User
    const user = await User.findById(req.userAuth);

    // Push the comment to the User
    user.comments.push(comment._id);

    //  Save both
    await post.save();
    await user.save();

    res.json({
      status: "Success",
      data: comment,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  const { description } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.user.toString() !== req.userAuth.toString()) {
      return next(
        appError("Access is denied, This post is not belongs to you", 403)
      );
    } else {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { description },
        { new: true, runValidators: true }
      );

      res.json({
        status: "Success",
        data: updatedComment,
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.user.toString() !== req.userAuth.toString()) {
      return next(
        appError("Access is denied, This post is not belongs to you", 403)
      );
    } else {
      const deletedComment = await Comment.findByIdAndDelete(req.params.id);

      res.json({
        status: "Success",
        data: 'Comment is deleted successfully',
      });
    }
  } catch (error) {
    next(appError(error.message));
  }
};
