import User from "../models/UserMod/UserModel.js";
import { appError } from "../utils/appError.js";
import { getTokenFromHeaders } from "../utils/getTokenFromHeaders.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isAdmin = async (req, res, next) => {
  try {
    //Get token from header
    const token = getTokenFromHeaders(req);
    //Verify Token
    const decodedUser = verifyToken(token);

    //save the user into req object
    req.userAuth = decodedUser.id;

    const user = await User.findById(decodedUser.id);

    // Check if user is Admin or not
    if (user && user.isAdmin) {
      return next();
    } else {
      return next(
        appError("Acces Denied, Admin only can have this acces", 403)
      );
    }
  } catch (error) {
    console.log('Error in isAdmin Miidleware', error.message)
  }
};
