import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";
import axios from "axios";


const addUser = asyncHandler(async (req, res) => {
    const { email, password, name, authMethod } = req.body;

    try {
        let firebaseUser;
        if (authMethod === 'google') {
            throw new ApiError(400, 'Google user creation must be done manually in Firebase Console');
        }

        // Create Firebase user
        firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Save user in MongoDB
        const newUser = new User({
            firebaseUid: firebaseUser.uid,
            email,
            name,
            authMethod: 'email/password',
        });

        await newUser.save();
        res.status(201).json(new ApiResponse(201, newUser, 'User added successfully'));
    } catch (error) {
        if (firebaseUser && firebaseUser.uid) {
            // Cleanup Firebase user if MongoDB save fails
            await admin.auth().deleteUser(firebaseUser.uid).catch(console.error);
        }
        throw new ApiError(500, `Failed to add user: ${error.message}`);
    }
});


const deleteUser = asyncHandler(async (req, res) => {
    const { firebaseUid } = req.body;

    try {
        // Delete user from Firebase
        await admin.auth().deleteUser(firebaseUid);

        // Delete user from MongoDB
        await User.deleteOne({ firebaseUid });

        res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        throw new ApiError(500, `Failed to delete user: ${error.message}`);
    }
});


export{
    addUser,
    deleteUser
}