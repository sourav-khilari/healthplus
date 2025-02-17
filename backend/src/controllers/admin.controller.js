import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Hospital } from "../models/hospital.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";
import nodemailer from "../utils/sendEmail.js"
import bcrypt from "bcrypt"

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


// const getAllUsers = asyncHandler(async (req, res) => {
//     try {
//         // Check if the requester is an admin
//         if (req.user.role !== 'admin') {
//             throw new ApiError(403, 'Access denied: Admins only');
//         }

//         // Fetch all users from MongoDB
//         const users = await User.find({}) 
//             .select('name email role createdAt')       // Select only required fields
//             .sort({ createdAt: -1 });                  // Sort users by creation date (newest first)

//         return res.status(200).json(
//             new ApiResponse(200, users, 'Users fetched successfully')
//         );
//     } catch (error) {
//         throw new ApiError(500, `Failed to fetch users: ${error.message}`);
//     }
// });



const getAllUsers = asyncHandler(async (req, res) => {
    try {
        // Check if the requester is an admin or subadmin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins and Subadmins only');
        }

        // Fetch all users from MongoDB, excluding admins and subadmins
        //   const users = await User.find({ role: { $ne: 'admin' }, role: { $ne: 'subadmin' } })
        //     .select('name email role createdAt')
        //     .sort({ createdAt: -1 });
        const users = await User.find({ $and: [{ role: { $ne: 'admin' } }, { role: { $ne: 'superadmin' } }] })
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, users, 'Users fetched successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Failed to fetch users: ${error.message}`);
    }
});



const updateUserStatus = asyncHandler(async (req, res) => {
    const { firebaseUid, status } = req.body; // firebaseUid: Firebase UID, status: true/false
    
    try {
        // Check if the requester is an admin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        // Update the user's status in MongoDB
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        user.status = status;
        await user.save();

        // Update the user's status in Firebase
        await admin.auth().updateUser(firebaseUid, {
            disabled: !status, // Firebase uses `disabled` for account activation/deactivation
        });

        return res.status(200).json(
            new ApiResponse(200, { firebaseUid, status }, `User ${status ? 'activated' : 'deactivated'} successfully`)
        );
    } catch (error) {
        throw new ApiError(500, `Failed to update user status: ${error.message}`);
    }
});



const approveOrDeclineHospital = asyncHandler(async (req, res) => {
    const { hospitalId, action } = req.body; // action: 'approve' or 'decline'

    try {
        // Check if requester is an admin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            throw new ApiError(404, 'Hospital not found');
        }

        if (action === 'approve') {
            // Generate a password for the hospital
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save password and set status to 'approved'
            hospital.status = 'approved';
            hospital.password = hashedPassword;

            // Create hospital account in Firebase
            const firebaseUser = await admin.auth().createUser({
                email: hospital.email,
                password,
                displayName: hospital.name,
            });
            hospital.firebaseUid = firebaseUser.uid;

            await hospital.save();

            // Send email to the hospital with credentials
            const message = `
                Congratulations, your registration is approved!
                Here are your login credentials:
                Email: ${hospital.email}
                Password: ${password}
            `;
            await nodemailer(hospital.email, 'Registration Approved', message);

            return res.status(200).json(
                new ApiResponse(200, null, 'Hospital approved and credentials sent')
            );
        } else if (action === 'decline') {
            // Set status to 'rejected'
            hospital.status = 'rejected';
            await hospital.save();

            return res.status(200).json(
                new ApiResponse(200, null, 'Hospital registration declined')
            );
        } else {
            throw new ApiError(400, 'Invalid action');
        }
    } catch (error) {
        throw new ApiError(500, `Failed to process request: ${error.message}`);
    }
});

const getPendingHospitals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const pendingHospitals = await Hospital.find({ status: 'pending' }, '-password');

        return res.status(200).json(
            new ApiResponse(200, pendingHospitals, 'Pending hospitals retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Failed to retrieve pending hospitals: ${error.message}`);
    }
});

const getRejectedHospitals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const rejectedHospitals = await Hospital.find({ status: 'rejected' }, '-password');

        return res.status(200).json(
            new ApiResponse(200, rejectedHospitals, 'Rejected hospitals retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Failed to retrieve rejected hospitals: ${error.message}`);
    }
});


const getApprovedHospitals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const approvedHospitals = await Hospital.find({ status: 'approved' }, '-password');

        return res.status(200).json(
            new ApiResponse(200, approvedHospitals, 'Approved hospitals retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Failed to retrieve approved hospitals: ${error.message}`);
    }
});





export {
    addUser,
    deleteUser,
    getAllUsers,
    updateUserStatus,
    approveOrDeclineHospital,
    getPendingHospitals,
    getRejectedHospitals,
    getApprovedHospitals,
}