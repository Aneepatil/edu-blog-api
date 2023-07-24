import { appError } from "../utils/appError.js";
import { getTokenFromHeaders } from "../utils/getTokenFromHeaders.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLogin = (req, res, next) => {
  //Get token from header
  const token = getTokenFromHeaders(req);
  //Verify Token
  const decodedUser = verifyToken(token);
  
  //save the user into req object
  req.userAuth = decodedUser.id

  if (!decodedUser) {
    return next(appError("Invalid / Expired Token, Please Login again",500));
  } else {
    next();
  }

};
