import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {admin} from "../config/firebase.js"

const adminMiddleware = asyncHandler(async (req, res, next) => {
    const { authToken } = req.cookies;

    if (!authToken) {
        throw new ApiError(401, 'Unauthorized: No token provided');
    }

    try {
        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        const { uid } = decodedToken;

        // Check if user is an admin in MongoDB
        const adminUser = await Admin.findOne({ firebaseUid: uid });
        if (!adminUser) {
            throw new ApiError(403, 'Forbidden: Admin access required');
        }

        req.adminUser = adminUser; // Add admin data to the request object
        next();
    } catch (error) {
        throw new ApiError(401, `Unauthorized: ${error.message}`);
    }
});
