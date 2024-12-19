import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {admin} from "../config/firebase.js"

//const admin = require('../config/firebase');


const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if the user exists in MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      
      throw new ApiError(401, "Invalid Access Token or User not found in the database")
    }

    // Attach user information to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: user.name,
    };

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});

export{
    authMiddleware,
}    
