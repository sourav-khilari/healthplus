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






const loginDoctor = asyncHandler(async (req, res) => {
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
});


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


const fetchPatientData = asyncHandler(async (req, res) => {
    const { patientId } = req.body;
    const userId = req.user._id;

    if (!patientId || !userId) throw new ApiError(400, 'Patient ID and User ID are required');

    // Step 1: Fetch patient details from FHIR API or fallback to MongoDB
    let patientData;
    try {
        const apiResponse = await axios.get(`http://hapi.fhir.org/baseR4/Patient/${patientId}`);
        patientData = apiResponse.data;

        // Extract details
        const email = patientData.telecom?.[0]?.value; // Email
        const contact = patientData.telecom?.[1]?.value; // Contact

        if (!email) throw new ApiError(500, "Email not found in FHIR API data");

        // Save data in MongoDB if not already present
        const existingPatient = await Patient.findOne({ patientId });
        if (!existingPatient) {
            await Patient.create({
                patientId,
                name: `${patientData.name?.[0]?.given?.join(' ')} ${patientData.name?.[0]?.family}` || 'Unknown',
                dob: patientData.birthDate || 'N/A',
                email,
                contact,
                details: patientData,
            });
        }
    } catch (error) {
        console.error('FHIR API Error:', error.message);

        // Fallback to MongoDB if FHIR API fails
        const patientFromDb = await Patient.findOne({ patientId });
        if (!patientFromDb) throw new ApiError(404, "Patient not found in both FHIR API and MongoDB");

        patientData = patientFromDb;
    }

    // // Step 2: Add patientId to user's patient_ids array
    // const user = await User.findById(userId);
    // if (!user) throw new ApiError(404, 'User not found');

    // if (!user.patient_ids.includes(patientId)) {
    //     await User.updateOne(
    //         { _id: userId },
    //         { $addToSet: { patient_ids: patientId } } // Ensures no duplicates
    //     );
    // }

    // Step 3: Respond with patient details
    res.status(200).json(new ApiResponse(200, { patientDetails: patientData }, 'Patient data fetched successfully'));
});


const getDoctorAppointments =asyncHandler( async (req, res) => {
    const doctorId = req.params?.doctorId; // Doctor ID from request params
    const currentTime = new Date();
    const next24Hours = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

    // Get today's date range (start and end)
    const todayStart = new Date(currentTime);
    todayStart.setHours(0, 0, 0, 0); // Midnight of the current day
    const todayEnd = new Date(currentTime);
    todayEnd.setHours(23, 59, 59, 999); // End of the current day

    try {
        // Fetch appointments for today
        const todayAppointments = await Appointment.find({
            doctorId,
            "timeSlot.start": {
                $gte: todayStart, // From midnight today
                $lte: todayEnd,   // To end of today
            },
        })
            .populate('doctorId', 'name department speciality') // Optionally populate doctor details
            .populate('hospitalId', 'name location') // Optionally populate hospital details
            .sort({ 'timeSlot.start': 1 }); // Sort by time

        // Fetch appointments for the next 24 hours
        const next24HourAppointments = await Appointment.find({
            doctorId,
            "timeSlot.start": {
                $gte: currentTime, // From current time
                $lte: next24Hours, // Up to 24 hours from now
            },
        })
            .populate('doctorId', 'name department speciality') // Optionally populate doctor details
            .populate('hospitalId', 'name location') // Optionally populate hospital details
            .sort({ 'timeSlot.start': 1 }); // Sort by time

        // Combine both results (avoid duplicates)
        const uniqueAppointments = [
            ...new Map(
                [...todayAppointments, ...next24HourAppointments].map((item) => [
                    item._id.toString(),
                    item,
                ])
            ).values(),
        ];

        // Respond with combined appointments
        return res
            .status(200)
            .json(
                new ApiResponse(200, { appointments: uniqueAppointments }, 'Appointments fetched successfully.')
            );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, 'Failed to fetch appointments.'));
    }
});





export {
    loginDoctor,
    getPatientDetailsId,
    getDoctorAppointments,
    fetchPatientData ,
    
}
