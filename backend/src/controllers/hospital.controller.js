import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Hospital } from "../models/hospital.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";


//error not handled properly in decoded token part
const loginHospital = asyncHandler(async (req, res) => {
    const { email, password, idToken } = req.body;

    try {
        if(!idToken){
            throw new ApiError(400, 'Invalid login request');
        }
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const firebaseEmail = decodedToken?.email;

        if (email !== firebaseEmail) {
            throw new ApiError(401, 'Invalid Firebase ID token for the provided email');
        }

        // Find hospital in MongoDB
        const hospital = await Hospital.findOne({ email });
        if (!hospital || hospital.status !== 'approved') {
            throw new ApiError(400, 'Invalid email or account not approved');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            throw new ApiError(400, 'Invalid email or password');
        }

        // Use the Firebase ID token as the authToken
        const option = {
            httpOnly: true,
            secure: true, // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        // Set the authToken cookie to Firebase's ID token
        res.cookie('authToken', idToken, option);

        return res.status(200).json(new ApiResponse(200, hospital, 'Login successful'));
    } catch (error) {
        throw new ApiError(500, `Login failed: ${error.message}`);
    }
});


const registerHospital = asyncHandler(async (req, res) => {
    const { name, email, address, contactNumber } = req.body;

    try {
        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            throw new ApiError(400, 'Hospital already registered or request already submitted');
        }

        // Create a new hospital record with `pending` status
        const hospital = new Hospital({
            name,
            email,
            address,
            contactNumber,
            status: 'pending',
        });

        await hospital.save();

        return res.status(201).json(
            new ApiResponse(201, hospital, 'Registration request submitted successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Registration failed: ${error.message}`);
    }
});




export {
    registerHospital,
    loginHospital,
    
}