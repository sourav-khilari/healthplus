import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Hospital } from "../models/hospital.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";

import { Doctor } from "../models/doctor.model.js";
import {calendar} from '../config/googleCalendar.js'
import bcrypt from "bcrypt"
import sendEmail from '../utils/sendEmail.js'; 

const loginDoctor = async (req, res) => {
    const { idToken, password } = req.body;

    try {
        if (!idToken || !password) {
            throw new ApiError(400, 'idToken and password are required for login');
        }

        // Verify the idToken using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        // Find the doctor in the database using Firebase UID
        const doctor = await Doctor.findOne({ firebaseUid: uid });

        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, doctor.password);

        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password');
        }

        const option = {
            httpOnly: true,
            secure: true, // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        // Set a secure cookie with the idToken
        res.cookie('authToken', idToken, option);

        // Return a successful login response
        return res
            .status(200)
            .json(new ApiResponse(200, { doctor }, 'Doctor logged in successfully'));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to login doctor', error.message);
    }
};

const getPatientDetailsId = asyncHandler(async (req, res) => {
    try {
      const { patientId } = req.params; // Extract patient ID from the route parameter
      const patient = await Patient.findById({
        patientId}); 
  
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      res.json(patient);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Unable to fetch patient details" });
    }
});


export {
    loginDoctor,
    getPatientDetailsId,
}
