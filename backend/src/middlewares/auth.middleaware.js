import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User, } from "../models/user.model.js";
import { admin } from "../config/firebase.js"
import { Hospital } from "../models/hospital.model.js"
import { Doctor } from "../models/doctor.model.js"
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


// const refreshAuthToken = async (expiredToken) => {
//   try {
//     // Decode the expired token to get the UID
//     const decodedToken = admin.auth().decodeIdToken(expiredToken, true); // true = allow expired token
//     const { uid } = decodedToken;

//     // Generate a new custom token
//     const newToken = await admin.auth().createCustomToken(uid);

//     // Verify the newly generated token
//     const newIdToken = await admin.auth().verifyIdToken(newToken);

//     return { idToken: newIdToken, uid };
//   } catch (error) {
//     throw new ApiError(401, `Unable to refresh token: ${error.message}`);
//   }
// };


// const roleMiddleware = (requiredRole) => asyncHandler(async (req, res, next) => {
//   const authToken = req.cookies?.authToken;
//   //const cookie = req.headers.cookie;
//   // console.log("\n\ncookie=" + cookie + "\n\n")
//   // console.log("\n\n" + authToken + "\n\n")
//   if (!authToken) {
//     throw new ApiError(401, 'Unauthorized: No token provided');
//   }

//   try {
//     // Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(authToken);
//     const { uid } = decodedToken;
//     const now = Math.floor(Date.now() / 1000);
//     if (decodedToken.exp < now) {
//       return res.status(401).json({ error: 'Token expired' });
//     }
//     let user = "";
//     // Check user's role in MongoDB
//     if (requiredRole === "hospital") {
//       user = await Hospital.findOne({ firebaseUid: uid });
//     }
//     else {
//       user = await User.findOne({ firebaseUid: uid });
//     }
//     if (!user) {
//       throw new ApiError(404, 'User not found');
//     }

//     if (user.role !== requiredRole) {
//       throw new ApiError(403, `Forbidden: ${requiredRole} access required`);
//     }

//     req.user = user; // Attach user data to the request object
//     next();
//   } catch (error) {
//     throw new ApiError(401, `Unauthorized: ${error.message}`);
//   }
// });



const refreshAuthToken = async (expiredToken) => {
  if (!expiredToken) {
    throw new ApiError(401, 'Expired token is required');
  }
  let decodedToken
  try {
    decodedToken = await admin.auth().verifyIdToken(expiredToken, { checkRevoked: false });
    const { uid } = decodedToken;
    console.log("\n\ndecode\n\n");
    const newToken = await admin.auth().createCustomToken(uid);
    return { idToken: newToken, uid };
  } catch (error) {
    // Log or monitor the error
    console.error('Error refreshing token:', error);
    throw new ApiError(401, `Unable to refresh token: ${error.message}`);
  }
};




const roleMiddleware = (requiredRole) => asyncHandler(async (req, res, next) => {
  const authToken = req.cookies?.authToken;
  if (!authToken) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }
  //console.log("\n\nauthToken="+ authToken+"\n\n");
  try {
    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(authToken);
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        // Token expired, attempt to refresh it
        const { idToken: newIdToken, uid } = await refreshAuthToken(authToken);

        // Update the authToken cookie with the new token
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set true in production
          sameSite: 'None',
          domain: 'localhost', // Match your backend domain
          path: '/',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        };
        res.cookie('authToken', newIdToken, options);

        // Use the new token for verification
        decodedToken = await admin.auth().verifyIdToken(newIdToken);
      } else {
        throw new ApiError(401, `Unauthorized: ${error.message}`);
      }
    }

    const { uid } = decodedToken;

    // Fetch the user from MongoDB
    let user;
    if (requiredRole === 'doctor') {
      user = await Doctor.findOne({ firebaseUid: uid });
    }
    else if (requiredRole === 'hospital') {
      user = await Hospital.findOne({ firebaseUid: uid });
    } else {
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
