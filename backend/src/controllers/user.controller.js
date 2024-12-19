import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js"

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name, idToken } = req.body;

    try {
        let firebaseUser;
        let createdUser;
        if (idToken) {
            // Google Registration
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email: firebaseEmail, name: firebaseName } = decodedToken;

            // Check if the user exists in Firebase
            firebaseUser = await admin.auth().getUser(uid);

            // Save to MongoDB if not already present
            let user = await User.findOne({ firebaseUid: uid });
            if (!user) {
                user = new User({
                    firebaseUid: uid,
                    email: firebaseEmail,
                    name: firebaseName || firebaseEmail.split('@')[0],
                    authMethod: 'google',
                });
                createdUser = await user.save();
            }
        } else if (email && password) {
            // Email/Password Registration
            firebaseUser = await admin.auth().createUser({
                email,
                password,
                displayName: name,
            });

            // Save to MongoDB
            let user = new User({
                firebaseUid: firebaseUser.uid,
                email,
                name,
                authMethod: 'email/password',
            });
            createdUser = await user.save();
        } else {
            throw new ApiError(400, 'Invalid registration request');
        }

        res.status(201).json(
            new ApiResponse(201, createdUser, 'User registered successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Registration failed: ${error.message}`);
    }
});



const login = asyncHandler(async (req, res) => {
    const { idToken, email } = req.body;

    try {
        let decodedToken;

        if (idToken) {
            // Google Login or Email/Password Login (handled via idToken)
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } else {
            throw new ApiError(400, 'Invalid login request');
        }

        const { uid } = decodedToken;

        // Check if the user exists in MongoDB
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            throw new ApiError(404, 'User not found in the database');
        }
        const option = {
            httpOnly: true,
            secure: true, // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }
        // Save token in cookies
        res.cookie('authToken', idToken, option);

        res.status(200).json(new ApiResponse(200, user, 'Login successful'));
    } catch (error) {
        throw new ApiError(500, `Login failed: ${error.message}`);
    }
});


export {
    login,
    registerUser,
}


