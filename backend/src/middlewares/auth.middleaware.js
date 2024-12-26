import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User, } from "../models/user.model.js";
import { admin } from "../config/firebase.js"
import { Hospital } from "../models/hospital.model.js"
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


const roleMiddleware = (requiredRole) => asyncHandler(async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const { uid } = decodedToken;
    let user = "";
    // Check user's role in MongoDB
    if (requiredRole === "hospital") {
      user = await Hospital.findOne({ firebaseUid: uid });
    }
    else {
      user = await User.findOne({ firebaseUid: uid });
    }
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role !== requiredRole) {
      throw new ApiError(403, `Forbidden: ${requiredRole} access required`);
    }

    req.user = user; // Attach user data to the request object
    next();
  } catch (error) {
    throw new ApiError(401, `Unauthorized: ${error.message}`);
  }
});


export {
  authMiddleware,
  roleMiddleware,
}    
