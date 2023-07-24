import Post from "../../models/PostMod/PostModel.js";
import User from "../../models/UserMod/UserModel.js";
import { appError } from "./../../utils/appError.js";

// =================================================== Creating Post============================================================//

export const createPost = async (req, res, next) => {
  // console.log(req.file)
  const { title, description, category } = req.body;

  try {
    //  Find the user who is creating a post
    const author = await User.findById(req.userAuth);
    //check if the user is blocked
    if (author?.isBlocked) {
      return next(appError("Access Denaid since your account is blocked", 403));
    }

    //  Create a post
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
      category,
      photo: req?.file?.path
    });

    // 3.Assciate user to a post - Push the post into the users post field
    author.posts.push(postCreated);

    await author.save();

    res.json({
      status: "Success",
      data: postCreated,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Fetching All Post============================================================//

export const fetchAllPosts = async (req, res, next) => {
  try {
    // Find all posts
    const allPosts = await Post.find()
      .populate("user")
      .populate("category", "title");

    // Check if the user is blocked by the post owner

    const filteredPosts = allPosts.filter((post) => {
      // Getting all blocked user
      const blockedUsers = post.user.blocked;
      const isBlocked = blockedUsers.includes(req.userAuth);

      return isBlocked ? null : post;
    });

    res.json({
      status: "Success",
      data: filteredPosts,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Toggle Like Post============================================================//

export const toggleLikePost = async (req, res, next) => {
  try {
    //  Get the post
    const post = await Post.findById(req.params.id);

    // Check that user already liked the post

    const isLiked = post.likes.includes(req.userAuth);
    //  If user liked the post already
    if (isLiked) {
      //  Remove that user id from the likes array
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.userAuth.toString()
      );
      await post.save();
    } else {
      // Add the user array to the likes array
      post.likes.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "Success",
      // data: post,
      data: "You have liked the post",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Toggle Dis-like Post============================================================//

export const toggleDisLikePost = async (req, res, next) => {
  try {
    //  Get the post
    const post = await Post.findById(req.params.id);

    // Check that user already liked the post

    const isDisLiked = post.disLikes.includes(req.userAuth);
    //  If user liked the post already
    if (isDisLiked) {
      //  Remove that user id from the disLikes array
      post.disLikes = post.disLikes.filter(
        (disLike) => disLike.toString() !== req.userAuth.toString()
      );
      await post.save();
    } else {
      // Add the user array to the disLikes array
      post.disLikes.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "Success",
      // data: post,
      data: "You have disliked the post",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Detail of Post============================================================//

export const postDetail = async (req, res, next) => {
  
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.userAuth)
    console.log(user)
    //Number of view
    //check if user viewed this post
    const isViewed = post.numViews.includes(req.userAuth);
    if (isViewed) {
      res.json({
        status: "success",
        data: post,
      });
    } else {
      //pust the user into numOfViews

      post.numViews.push(req.userAuth);
      //save
      await post.save();
      res.json({
        status: "success",
        data: post,
      });
    }

  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Updating Post============================================================//

export const updatePost = async (req, res,next) => {

  const {title,description,category} = req.body

  try {

    //  Find the Post to update
    const post = await Post.findById(req.params.id)
    
    // Check if post is belongs to logged-in User or not
    if( post?.user.toString() !== req.userAuth.toString() ){
      return next(appError('Access is denied, This post is not belongs to you', 403))
    }else{
      await Post.findByIdAndUpdate(req.params.id,{title,description,category,photo:req?.file?.path},{new:true})
    } 

    res.json({
      status: "Success",
      data: "Post Updated Successfully.",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// =================================================== Deleting Post============================================================//

export const deletePost = async (req, res, next) => {
  try {

    // Check if post is belongs to logged-in User are not
    //  Find the Post
    const post = await Post.findById(req.params.id)

    if( post.user.toString() !== req.userAuth.toString() ){
      return next(appError('Access is denied, This post is not belongs to you', 403))
    }else{
      await Post.findByIdAndDelete(req.params.id)
    } 

    res.json({
      status: "Success",
      data: "Post Deleted Successfully.",
    });
  } catch (error) {
    next(appError(error.message));
  }
};
