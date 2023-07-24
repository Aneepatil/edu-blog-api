import mongoose, { Schema, model } from "mongoose";
import Post from "../PostMod/PostModel.js";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
    },
    profilePicture: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "E-mail is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false, // Ensure the default value is set to false
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Editor"],
      default: "Guest", // Set the default role to 'Guest'
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      // Corrected the property name from "fallowers" to "followers"
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      // Corrected the property name from "fallowing" to "following"
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],  
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: [
      {
        type: String,
        enum: ["Free", "Premium", "Pro"],
        default: "Free", // Set the default role to 'Guest'
      },
    ],
    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//  Hooks
// Pre- Before record is saved

userSchema.pre("findOne", async function (next) {
  this.populate({
    path: "posts",
  });

  //  Get the user id
  const query = this.getQuery();
  const userId = query._id;

    //  Finding the post created buy the user

    const postFound = await Post.find({ user: userId });

    //  Get the last post created by the user
    const lastPost = postFound[postFound.length - 1];
    const lastPostDate = new Date(lastPost?.createdAt);
    const lastPostDateStr = lastPostDate.toDateString();

    //  Adding vertuals to the Schema
    userSchema.virtual("lastPostDate").get(function () {
      return lastPostDateStr;
    });

    // Check if user is inactive or not posted single post for some days (Exp:- 30 Days)
    //  Get current date
    const cuurentDate = new Date();
    const diff = cuurentDate - lastPostDate;

    //  Get the difference in days

    const diffInDays = diff / (1000 * 3600 * 24);

    // Checking Condition based on days

    if (diffInDays > 30) {
      userSchema.virtual("isInactive").get(function () {
        return true;
      });

      //  Find the user by id and block
      await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    } else {
      userSchema.virtual("isInactive").get(function () {
        return false;
      });

      await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    }

    // ---------------------Last Active Date--------------------------  //

    //  Convert to days ago for example 1 day ago

    const daysAgo = Math.floor(diffInDays);

    //  Add to virtuals lastActive in days to the Schema

    userSchema.virtual("lastActive").get(function () {
      //  Check if the day is less than 0 return Today, less than 1, yesterday

      if (daysAgo <= 0) {
        return "Today";
      } else if (daysAgo === 1) {
        return "Yesterday";
      } else if (daysAgo > 1) {
        return `${daysAgo} Days ago`;
      }
    });

    // ---------------------Award user based on post posted--------------------------  //

    const numOfPost = postFound.length;

    if (numOfPost <= 30) {
      await User.findByIdAndUpdate(
        userId,
        { userAward: "Bronze" },
        { new: true }
      );
    }
    if (numOfPost > 60) {
      await User.findByIdAndUpdate(
        userId,
        { userAward: "Silver" },
        { new: true }
      );
    }
    if (numOfPost > 90) {
      await User.findByIdAndUpdate(
        userId,
        { userAward: "Gold" },
        { new: true }
      );
    }
    if (numOfPost > 120) {
      await User.findByIdAndUpdate(
        userId,
        { userAward: "Platinium" },
        { new: true }
      );
    }

  next();
});

// Get fullname of the user by using mongoDB virtual method

userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// Get initials of the user by using mongoDB virtual method

userSchema.virtual("initials").get(function () {
  return `${this.firstname[0]}${this.lastname[0]}`;
});

// Get postCount of the user by using mongoDB virtual

userSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

// Get followersCount of the user by using mongoDB virtual

userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

// Get followingCount of the user by using mongoDB virtual

userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

// Get viewersCount of the user by using mongoDB virtual

userSchema.virtual("viewersCount").get(function () {
  return this.viewers.length;
});

// Get blockedCount of the user by using mongoDB virtual

userSchema.virtual("blockedCount").get(function () {
  return this.blocked.length;
});

userSchema.pre("save", function (next) {
  if (this.isBlocked === undefined) {
    this.isBlocked = true;
  }
  next();
});

const User = model("User", userSchema);

export default User;
