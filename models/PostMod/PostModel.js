import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    numViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Auther is required"],
    },
    photo: {
      type: String,
      required:[true,"Post Image is required"]
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Hook Of MongoDB ( Middleware )
//  We use JS Regex Method ( /^find/ ) insted of using findOne and find method

postSchema.pre(/^find/, function (next) {
  // Add view count to a virtual field
  postSchema.virtual("viewsCount").get(function () {
    return this.numViews.length;
  });

  // Add likes count to a virtual field
  postSchema.virtual("likesCount").get(function () {
    return this.likes.length;
  });

  // Add Dis-likes count to a virtual field
  postSchema.virtual("DisLikesCount").get(function () {
    return this.disLikes.length;
  });

  // Check the most liked post in Percentage
  postSchema.virtual("likedPercentage").get(function () {
    const total = Number(this.likes.length) + Number(this.disLikes.length);
    const percentage = (this.likes.length / total) * 100;
    return `${percentage}%`;
  });

  // Check the most Dis-liked post in Percentage
  postSchema.virtual("DislikedPercentage").get(function () {
    const total = Number(this.likes.length) + Number(this.disLikes.length);
    const percentage = (Number(this.disLikes.length) / total) * 100;
    return `${percentage}%`;
  });

  // Check the post created days ago

  postSchema.virtual("daysAgo").get(function () {
    const post = this;
    const date = new Date(post.createdAt);
    const daysAgo = Math.floor((Date.now() - date) / 86400000);

    return daysAgo === 0 ? 'Today': daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`
  });

  next();
});

const Post = model("Post", postSchema);

export default Post;
