import User from "../../models/UserMod/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "./../../utils/generateToken.js";
import { getTokenFromHeaders } from "../../utils/getTokenFromHeaders.js";
import { appError } from "../../utils/appError.js";
import { isAdmin } from "./../../middlewares/isAdmin.js";
import Post from "../../models/PostMod/PostModel.js";
import Category from './../../models/CategoryMod/CategoryMod.js';
import Comment from './../../models/CommentMod/CommentModel.js';

// ================================================ Register Functionlaity ==================================================

export const registerCtrl = async (req, res, next) => {
  const { firstname, lastname, email, password } =
    req.body;

  try {
    //Checking user exist
    const isUserExist = await User.findOne({ email });
    if (isUserExist) return next(appError("User already existed", 500));

    // Hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    //Create User

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPass,
    });

    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Login Functionality =========================================================

export const loginCtrl = async (req, res,next) => {
  const { email, password } = req.body;

  try {
    // Checking Email is Exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appError("Invalid Login Credentials..."));
    }

    // Verify Password
    const isPassMatched = await bcrypt.compare(password, userFound.password);

    if (!isPassMatched) {
      return next(appError("Invalid Login Credentials..." ));
    }

    // const { _id, firstname, lastname, email } = userFound;
    res.json({
      status: "Success",
      data: {
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.email,
        token: generateToken(userFound._id),
      },
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Get all Users =====================================================

export const allUsersCtrl = async (req, res,next) => {
  try {
    const users = await User.find();
    res.json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Get Single User ================================================

export const singleUserCtrl = async (req, res,next) => {
  // console.log(req)
  try {
    const user = await User.findById(req.userAuth);

    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ User Fallowing ================================================

export const followingCtrl = async (req, res, next) => {
  try {
    // 1. Find the user to fallow
    const userToFallow = await User.findById(req.params.id);

    // 2. Find the user who is fallowing
    const userWhoFallowed = await User.findById(req.userAuth);

    // 3.Check if user and whoFallowed is found

    if (userToFallow && userWhoFallowed) {
      // 4. Checking if userWhiFallowed is in user's followers array
      const isUserAlreadyFollowed = userToFallow.followers.find(
        (follwer) => follwer.toString() === userWhoFallowed._id.toString()
      );

      if (isUserAlreadyFollowed) {
        return next(appError("You already fallowed this user."));
      } else {
        //  5. Push userWhoFallowed into the user's followers array
        userToFallow.followers.push(userWhoFallowed._id);

        // 6. Push userToFollow into the userWhoFollowed's following array
        userWhoFallowed.following.push(userToFallow._id);

        //  Saving the both entries

        await userToFallow.save();
        await userWhoFallowed.save();

        res.json({
          status: "Success",
          data: "You are succesfully fallowing the user.",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ User UnFallowing ================================================

export const unFollowingCtrl = async (req, res, next) => {
  try {
    // 1. Find the user to unfallow
    const userToBeUnFollow = await User.findById(req.params.id);

    // 2. Find the user who is unfallowing
    const userWhoUnFollowed = await User.findById(req.userAuth);

    // 3.Check if user and useWhoUnFallowed is found

    if (userToBeUnFollow && userWhoUnFollowed) {
      // 4. Checking if userWhoUnFallowed is in user's followers array
      const isUserAlreadyFollowed = userToBeUnFollow.followers.find(
        (follwer) => follwer.toString() === userWhoUnFollowed._id.toString()
      );

      if (!isUserAlreadyFollowed) {
        return next(appError("You have not Followed this user."));
      } else {
        //  5. Remove userWhoUnFallowed from the user's followers array
        userToBeUnFollow.followers = userToBeUnFollow.followers.filter(
          (follower) => follower.toString() !== userWhoUnFollowed._id.toString()
        );

        // 6. Remove userToBeUnFollowed from the userWhoUnFollowed's following array
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (following) =>
            following.toString() !== userToBeUnFollow._id.toString()
        );

        //  Saving the both entries

        await userToBeUnFollow.save();
        await userWhoUnFollowed.save();

        res.json({
          status: "Success",
          data: "You have Unfollowed the user.",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Blocking Users =====================================================

export const blockUsersCtrl = async (req, res, next) => {
  try {
    // 1. Find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);

    // 2. Find the user who is blocking
    const userWhoBlocked = await User.findById(req.userAuth);

    // 3.Check if userToBeBlocked and userWhoBlocked are found

    if (userToBeBlocked && userWhoBlocked) {
      // 4. Checking if userToBeBlocked is in user's blocked array
      const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeBlocked._id.toString()
      );

      if (isUserAlreadyBlocked) {
        return next(appError("You have already blocked this user."));
      } else {
        //  5. Push userToBeBlocked into the user's blocked array
        userWhoBlocked.blocked.push(userToBeBlocked._id);

        //  Saving the both entries

        await userWhoBlocked.save();

        res.json({
          status: "Success",
          data: "You have Succesfully Blocked the User.",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Unblocking Users =====================================================

export const unBlockUsersCtrl = async (req, res, next) => {
  try {
    // 1. Find the user to be blocked
    const userToBeUnBlocked = await User.findById(req.params.id);

    // 2. Find the user who is blocking
    const userWhoUnBlocked = await User.findById(req.userAuth);

    // 3.Check if userToBeUnBlocked and userWhoUnBlocked are found

    if (userToBeUnBlocked && userWhoUnBlocked) {
      // 4. Checking if userToBeUnBlocked is in user's blocked array
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeUnBlocked._id.toString()
      );

      if (!isUserAlreadyBlocked) {
        return next(appError("You have not blocked this user."));
      } else {
        //  5. Remove userToBeUnBlocked from the user's blocked array
        userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
          (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
        );

        //  Saving the both entries

        await userWhoUnBlocked.save();

        res.json({
          status: "Success",
          data: "You have Succesfully Un-Blocked the User.",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Admin Block User ================================================

export const adminBlockUserCtrl = async (req, res, next) => {
  try {
    //  Find user To Be Blocked
    const userToBeBlocked = await User.findById(req.params.id);

    //  Check if user found

    if (!userToBeBlocked) {
      return next(appError("User Not Found"));
    }

    // Chenge User isBlocked to true

    userToBeBlocked.isBlocked = true;

    //  Save the user

    await userToBeBlocked.save();

    res.json({
      status: "Success",
      data: "Admin, You have blocked the user successfully",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Admin Un-Block User ================================================

export const adminUnBlockUserCtrl = async (req, res, next) => {
  
  try {
    
    //  Find user To Be UnBlocked
  const userToBeUnBlocked = await User.findById(req.params.id);

  //  Check if user found

  if (!userToBeUnBlocked) {
    return next(appError("User Not Found"));
  }

  // Chenge User isBlocked to true

  userToBeUnBlocked.isBlocked = false;

  //  Save the user

  await userToBeUnBlocked.save();

  res.json({
    status: "Success",
    data: "Admin, You have Un-blocked the user successfully",
  });

  } catch (error) {
    next(appError(error.message))
  }
  
};

// ================================================ Update User =========================================================

export const updateUserCtrl = async (req, res, next) => {
  const { email, firstname, lastname } = req.body;
  try {
    // Check if email is already taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appError("Email is already taken", 400));
      }
    }

    // Update the User

    const updatedUser = await User.findByIdAndUpdate(
      req.userAuth,
      { firstname, lastname, email },
      { new: true, runValidators: true }
    );

    await updatedUser.save();

    res.json({
      status: "Success",
      data: updatedUser,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Update Password =========================================================

export const updatePasswordCtrl = async (req, res,next) => {
  const { password } = req.body;

  try {

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // update User password

      const passUpdatedUser = await User.findByIdAndUpdate(
        req.userAuth,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );

      
    res.json({
      status: "Success",
      data: 'Password has been changed successfully.',
    });

    }else{
      return next(appError('Please Provide Password To Update.'))
    }

  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Delete User =========================================================

export const deleteUserCtrl = async (req, res) => {
  // console.log(req)
  try {
    // Find the user to be deleted
    const userToBeDeteled = await User.findById(req.userAuth)

    // Find all posts to be deleted by the user
    await Post.deleteMany({user:req.userAuth})
    // Delete all categories created by the user
    await Category.deleteMany({user:req.userAuth})
    // Delete all comments created by the user
    await Comment.deleteMany({user:req.userAuth})

    // Delete the user
    await User.findByIdAndDelete(req.userAuth);
    
    res.json({
      status: "Success",
      data: "Your account has been successfully deleted",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

// ================================================ Upload User Profile Picture =========================================================

export const uploadProfilePictureCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be updated

    const userToUpdate = await User.findById(req.userAuth);

    // 2.Check if user is found
    if (!userToUpdate) {
      return next(appError("User not found", 403));
    }
    // 3.Check if user is blocked
    if (userToUpdate.isBlocked) {
      return next(
        appError("Action is not allowed, your account is blocked.", 403)
      );
    }
    // 4.Check if user is updating their photo

    if (req.file) {
      // 5. Update the profile photo

      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePicture: req.file.path,
          },
        },
        { new: true }
      );
    }

    res.json({
      status: "Success",
      data: "You have updated your profile photo succesfully.",
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

// =========================================== Who Viewed My Profile Functionality ====================================================

export const whoViewedMyProfileCtrl = async (req, res, next) => {
  try {
    // 1. Find the Original User
    const user = await User.findById(req.params.id);

    // 2. Find the User who viewed Original User

    const userWhoViewed = await User.findById(req.userAuth);

    // 3. Check if Original User and who viewed, are found

    if (user && userWhoViewed) {
      // 4. Checking if userWhiViewed is already in the users viewer array

      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toString()
      );

      if (isUserAlreadyViewed) {
        return next(appError("You already viewed profile"));
      } else {
        // 5. Push the userWhoViewed to the user's viewers array
        user.viewers.push(userWhoViewed._id);

        // 6. Save the user

        await user.save();

        res.json({
          status: "Success",
          data: "Who viewed my profile",
        });
      }
    }
  } catch (error) {
    next(appError(error.message));
  }
};
