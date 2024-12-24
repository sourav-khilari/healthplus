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

//error not handled properly in decoded token part
const loginHospital = asyncHandler(async (req, res) => {
    const { email, password, idToken } = req.body;

    try {
        if(!idToken){
            throw new ApiError(400, 'Invalid login request');
        }
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        //console.log("\n\n"+email +"\n\n");
        const firebaseEmail = decodedToken?.email;
        //console.log("\n\n"+firebaseEmail +"\n\n");
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



const addDoctor = async (req, res) => {
    const { name, department, speciality, email, phone, hospitalId, availability,slotDuration } = req.body;

    try {
        // Create a Google Calendar for the doctor
        const calendarResponse = await calendar.calendars.insert({
            requestBody: {
                summary: `${name} - ${department}`,
                description: `Calendar for Dr. ${name} (${speciality})`,
            },
        });

        // Save doctor details in MongoDB
        const newDoctor = new Doctor({
            name,
            department,
            speciality,
            email,
            phone,
            hospitalId,
            calendarId: calendarResponse.data.id,
            availability,
            slotDuration
        });

        await newDoctor.save();
        return res.status(200).json(new ApiResponse(200,{ doctor: newDoctor}, 'Doctor added successfully'));
    } catch (error) {
        throw new ApiError(500, 'Failed to add doctor:',error.message);
    }
};

// GET /api/hospitals/:hospitalId/appointments
const getHospitalAllAppointments = asyncHandler(async (req, res) => {
    const { hospitalId } = req.params;

    try {
        // Validate if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Retrieve all doctors associated with the hospital
        const doctors = await Doctor.find({ hospitalId });

        // Get all appointments for these doctors
        const doctorIds = doctors.map((doctor) => doctor._id);
        const appointments = await Appointment.find({ doctorId: { $in: doctorIds } })
            .populate('patientId', 'name email') // Optional: Populate patient details
            .populate('doctorId', 'name department specialty') // Optional: Populate doctor details
            .sort({ date: 1 }); // Sort by date for better readability

        res.status(200).json({
            message: 'Appointments retrieved successfully',
            data: appointments,
        });
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve appointments: ${error.message}` });
    }
});


// GET /api/doctors/:doctorId/appointments
const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    try {
        // Validate if the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }

        // Retrieve all appointments for the doctor
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name email') // Optional: Populate patient details
            .sort({ date: 1, timeSlot: 1 }); // Sort by date and time

        
        return res.status(200).json(new ApiResponse(200,appointments, 'Doctor appointments retrieved successfully'));
    } catch (error) {
       
        throw new ApiError(500, 'Failed to retrieve doctor appointments: ', error.message);
    }
});





export {
    registerHospital,
    loginHospital,
    addDoctor,
    getHospitalAllAppointments,
    getDoctorAppointments,
}