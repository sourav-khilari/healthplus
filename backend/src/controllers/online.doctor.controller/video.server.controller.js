import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { Hospital } from "../../models/hospital.model.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { admin } from "../../config/firebase.js";

import { Doctor } from "../../models/doctor.model.js";
import {calendar} from '../../config/googleCalendar.js'
import bcrypt from "bcrypt"
import sendEmail from '../../utils/sendEmail.js'; 




const generateRandomPassword = (length = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};


// Doctor Registration
const registerDoctor = asyncHandler(async (req, res) => {
    const { name, department, speciality, email, phone, availability, slotDuration } = req.body;

    if (!name || !department || !speciality || !email || !availability || !slotDuration) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
        return res.status(400).json({ error: 'A doctor with this email already exists.' });
    }

    // Create a new doctor
    const newDoctor = await Doctor.create({
        name,
        department,
        speciality,
        email,
        phone,
        availability,
        slotDuration,
        isApproved: false, // Admin approval pending
    });

    res.status(201).json({
        message: 'Doctor application submitted successfully. Awaiting admin approval.',
        doctor: newDoctor,
    });
});


// Fetch all unapproved doctors
const getUnapprovedDoctors = asyncHandler(async (req, res) => {
    const unapprovedDoctors = await Doctor.find({ isApproved: false });
    res.status(200).json({ doctors: unapprovedDoctors });
});



const approveDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.body;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
    }

    if (doctor.isApproved) {
        return res.status(400).json({ error: 'Doctor is already approved.' });
    }

    // Generate credentials
    const password = generateRandomPassword(); // Custom function for random password
    const hashedPassword = await bcrypt.hash(password, 10);
    const firebaseUser = await admin.auth().createUser({
        email: doctor.email,
        password,
        displayName: doctor.name,
    });
   // hospital.firebaseUid = firebaseUser.uid;
    // Update doctor details
    doctor.password = hashedPassword;
    doctor.firebaseUid = firebaseUser.uid;
    doctor.isApproved = true;
    await doctor.save();

    // Send email with credentials
    const message = `
        Congratulations! Your application has been approved.
        Here are your login credentials:
        Email: ${doctor.email}
        Password: ${password}
    `;
    await sendEmail(doctor.email, 'Doctor Application Approved', message);

    res.status(200).json({ message: 'Doctor approved and notified successfully.' });
});





export{
    registerDoctor,
    getUnapprovedDoctors,
    approveDoctor,
    
}