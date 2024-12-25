import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";
import axios from "axios";
import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";
import { calendar } from '../config/googleCalendar.js'
import { Appointment } from '../models/appointment.model.js'
import { Patient } from "../models/patient.model.js";
import sendMail from "../utils/sendEmail.js"
import {FailedUploads} from '../models/failed.upload.model.js';
import fs from 'fs';


const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name, idToken } = req.body;
    let firebaseUser;

    try {
        let createdUser;

        if (idToken) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email: firebaseEmail } = decodedToken;

            firebaseUser = await admin.auth().getUser(uid);

            let user = await User.findOne({ firebaseUid: uid });
            if (user) {
                if (!user.status) {
                    throw new ApiError(403, 'Account is deactivated. Please contact support.');
                }
                throw new ApiError(409, 'User already registered');
            }

            user = new User({
                firebaseUid: uid,
                email: firebaseEmail,
                name: decodedToken.name || firebaseEmail.split('@')[0],
                authMethod: 'google',
            });
            createdUser = await user.save();
        } else if (email && password) {
            firebaseUser = await admin.auth().createUser({
                email,
                password,
                displayName: name,
            });

            let user = await User.findOne({ email });
            if (user) {
                if (!user.status) {
                    throw new ApiError(403, 'Account is deactivated. Please contact support.');
                }
                throw new ApiError(409, 'User already registered');
            }

            createdUser = new User({
                firebaseUid: firebaseUser.uid,
                email,
                name,
                authMethod: 'email/password',
            });
            await createdUser.save();
        } else {
            throw new ApiError(400, 'Invalid registration request');
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, 'User registered successfully')
        );
    } catch (error) {
        if (firebaseUser && firebaseUser.uid) {
            await admin.auth().deleteUser(firebaseUser.uid).catch((cleanupError) => {
                console.error('Error cleaning up Firebase user:', cleanupError.message);
            });
        }
        throw new ApiError(500, `Registration failed: ${error.message}`);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    try {
        let decodedToken;

        if (idToken) {
            // Verify Firebase ID token
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

        if (!user.status) {
            throw new ApiError(403, 'Account is deactivated. Please contact support.');
        }

        // Save token in cookies
        const options = {
            httpOnly: true,
            secure: true, // Set to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };
        res.cookie('authToken', idToken, options);

        // Check user's role
        if (user.role === 'admin') {
            return res.status(200).json(new ApiResponse(200, user, 'Admin login successful'));
        } else if (user.role === 'user') {
            return res.status(200).json(new ApiResponse(200, user, 'User login successful'));
        } else {
            throw new ApiError(403, 'Unauthorized role');
        }
    } catch (error) {
        throw new ApiError(500, `Login failed: ${error.message}`);
    }
});


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const logoutUser = asyncHandler(async(req, res) => {
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset: {
    //             refreshToken: 1 // this removes the field from document
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("authToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
    //.clearCookie("refreshToken", options)
})


const getAllHospitals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const approvedHospitals = await Hospital.find({ status: 'approved' }, '-password', 'status');

        return res.status(200).json(
            new ApiResponse(200, approvedHospitals, 'Approved hospitals retrieved successfully')
        );
    } catch (error) {
        throw new ApiError(500, `Failed to retrieve approved hospitals: ${error.message}`);
    }
});



const nearestHospital = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query; // Latitude and Longitude from the query


    if (!lat || !lng) {
        throw new ApiError(400, "Latitude and Longitude are required.");
    }
    console.log("lat=" + lat + "\n" + "lan=" + lng);
    const GEOAPIFY_API_KEY = "1fbb9d4b37744f8086172d1358dba01b";
    //const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},15000&limit=10&apiKey=1fbb9d4b37744f8086172d1358dba01b`;
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},15000&limit=10&apiKey=${GEOAPIFY_API_KEY}`;
    try {
        //console.log("\nurl\n");
        const response = await axios.get(url);
        //console.log("\nurl\n");
        //console.log(response);
        //res.status(200).json(new ApiResponse(200, response.data.features, 'Login successful'));
        return res.json(response.data.features); // Return hospital data
    } catch (error) {
        //console.error("Error fetching hospitals:", error);
        throw new ApiError(500, "Failed to fetch hospital data.");
    }
});



const nearestPharmacy = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query; // Latitude and Longitude from the query

    if (!lat || !lng) {
        throw new ApiError(400, "Latitude and Longitude are required.");
    }
    const GEOAPIFY_API_KEY = "1fbb9d4b37744f8086172d1358dba01b";
    //console.log("lat="+lat+"\n"+"lan="+lng);
    //const url = `https://api.geoapify.com/v2/places?categories=healthcare.pharmacy&filter=circle:${lng},${lat},15000&limit=10&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.pharmacy&filter=circle:${lng},${lat},15000&limit=10&apiKey=${GEOAPIFY_API_KEY}`;
    try {
        const response = await axios.get(url);
        //console.log(response);
        //return res.status(200).json(new ApiResponse(200, response.data.features, 'Login successful'));
        return res.json(response.data.features); // Return hospital data
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        throw new ApiError(500, "Failed to fetch hospital data.", error);

    }
})

//get-available-slots/:doctorId/:date

const calculateFreeSlots = (availability, bookedSlots, slotDuration) => {
    const freeSlots = [];
    // const dayAvailability = availability.find((slot) => slot.day === new Date(date).getDay());
    // if (!dayAvailability) return [];
    availability.forEach(({ day, startTime, endTime }) => {

        const startHour = parseInt(startTime.split(':')[0]);
        const startMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);

        // Generate all slots within the available time range
        let current = new Date();
        current.setHours(startHour, startMinute, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);

        while (current < end) {
            const slotStart = new Date(current);
            current.setMinutes(current.getMinutes() + slotDuration);
            const slotEnd = new Date(current);

            // Check if the slot overlaps with any booked slot
            const isBooked = bookedSlots.some((booked) => {
                const bookedStart = new Date(booked.start);
                const bookedEnd = new Date(booked.end);
                return (
                    (slotStart >= bookedStart && slotStart < bookedEnd) ||
                    (slotEnd > bookedStart && slotEnd <= bookedEnd)
                );
            });

            if (!isBooked) {
                freeSlots.push({ start: slotStart, end: slotEnd });
            }
        }
    });

    return freeSlots;
};

//get doctor 
const getAvailableSlots = asyncHandler(async (req, res) => {
    const { doctorId, date } = req.params;
    console.log(doctorId);
    console.log(date)
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found 1st' });

        // Fetch booked slots from Google Calendar
        //const calendar = await google.calendar('v3');
        const events = await calendar.events.list({
            calendarId: doctor.calendarId,
            timeMin: new Date(`${date}T00:00:00Z`).toISOString(),
            timeMax: new Date(`${date}T23:59:59Z`).toISOString(),
            singleEvents: true,
        });
        console.log("after event")
        const bookedSlots = events.data.items.map((event) => ({
            start: event.start.dateTime,
            end: event.end.dateTime,
        }));
        console.log("after event1")
        // Filter availability for the specific day
        const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });
        const availability = doctor.availability.filter((slot) => slot.day === dayOfWeek);

        // Calculate free slots
        const freeSlots = calculateFreeSlots(availability, bookedSlots, doctor.slotDuration);


        return res.status(200).json(new ApiResponse(200, {bookedSlots, freeSlots }, 'all free slots for particular doctor'));
    } catch (error) {
        //res.status(500).json({ error: `Failed to fetch slots: ${error.message}` });
        throw new ApiError(500, "Failed to fetch slots", error.message);
    }
});

const getAllDoctors = asyncHandler(async (req, res) => {
    try {
        // Fetch all doctors, optionally filtering by query params
        const filters = {};
        if (req.query?.department) {
            filters.department = req.query.department;
        }
        if (req.query?.hospitalId) {
            filters.hospitalId = req.query.hospitalId;
        }

        //const doctors = await Doctor.find(filters).populate('hospitalId', 'name location');
        const doctors = await Doctor.find(filters)

        return res.status(200).json(new ApiResponse(200, doctors, 'All doctor'));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch doctor", error.message);
    }
});


const checkAvailability = async (doctorId, date, timeSlot) => {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');

    // Ensure time slot falls within availability
    const availability = doctor.availability.find((day) => day.day === new Date(date).toLocaleDateString('en-US', { weekday: 'long' }));
    if (!availability) return false;

    const slotStart = new Date(timeSlot.start).getTime();
    const availabilityStart = new Date(availability.startTime).getTime();
    const availabilityEnd = new Date(availability.endTime).getTime();

    if (slotStart < availabilityStart || slotStart >= availabilityEnd) return false;

    // Ensure time slot is not already booked
    const appointments = await Appointment.find({ doctorId, date, $or: [{ 'timeSlot.start': { $lte: timeSlot.end } }, { 'timeSlot.end': { $gte: timeSlot.start } }] });
    return appointments.length === 0;
};


//timeslot format that i send in frontend
// "timeSlot": {
//     "start": "2024-12-23T10:00:00.000Z",
//     "end": "2024-12-23T11:00:00.000Z"
//}



const bookAppointment = asyncHandler(async (req, res) => {
    const { patientName,patient_id, patientEmail, doctorId, hospitalId, date, timeSlot } = req.body;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) throw new Error('Doctor not found');

        // Check if doctor is available at the given time slot
        const isAvailable = await checkAvailability(doctorId, date, timeSlot);
        if (!isAvailable) return res.status(400).json({ error: 'Doctor is not available in given time slot' });

        // Create event in Google Calendar
        const event = {
            summary: `Appointment with ${patientName}`,
            description: `Patient Email: ${patientEmail}`,
            start: { dateTime: timeSlot.start, timeZone: 'UTC' },
            end: { dateTime: timeSlot.end, timeZone: 'UTC' },
        };
        const eventResponse = await calendar.events.insert({ calendarId: doctor.calendarId, requestBody: event, });

        // Save appointment in MongoDB
        const newAppointment = new Appointment({
            patientName, patientEmail, doctorId,patient_id, hospitalId, date, timeSlot, calendarEventId: eventResponse.data.id,
        });
        await newAppointment.save();
        return res.status(200).json(new ApiResponse(200, { appointment: newAppointment }, 'Appointment booked successfully'));

    } catch (error) {
        throw new ApiError(500, "Failed to book appointment: ", error.message);

    }
});


const updateAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { newDate, newTimeSlot } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new Error('Appointment not found');

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) throw new Error('Doctor not found');

        const isAvailable = await checkAvailability(doctor._id, newDate, newtimeSlot);
        if (!isAvailable) return res.status(400).json({ error: 'Doctor is not available in given time slot' });

        // Update the event in Google Calendar
        const updatedEvent = await calendar.events.update({
            calendarId: doctor.calendarId,
            eventId: appointment.calendarEventId,
            requestBody: {
                start: { dateTime: newTimeSlot.start, timeZone: 'UTC' },
                end: { dateTime: newTimeSlot.end, timeZone: 'UTC' },
            },
        });

        // Update appointment in MongoDB
        appointment.date = newDate;
        appointment.timeSlot = newTimeSlot;
        await appointment.save();
        return res.status(200).json(new ApiResponse(200, appointment, 'Appointment rescheduled successfully'));

    } catch (error) {
        throw new ApiError(500, "Failed to update appointment: ", error.message);

    }
});

const deleteAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new Error('Appointment not found');

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) throw new Error('Doctor not found');

        // Delete the event from Google Calendar
        await calendar.events.delete({
            calendarId: doctor.calendarId,
            eventId: appointment.calendarEventId,
        });

        // Mark as canceled or delete from MongoDB
        await Appointment.findByIdAndDelete(appointmentId);

        return res.status(200).json(new ApiResponse(200, appointment, 'AppointmAppointment canceled successfully'));
    } catch (error) {
        throw new ApiError(500, "Failed to cancel appointment: ", error.message);
    }
});



// const verifyOTP = asyncHandler(async (req, res) => {
//     const { patientId, otp } = req.body;

//     if (!patientId || !otp) throw new APIError('Patient ID and OTP are required', 400);

//     // Fetch patient data
//     const patient = await Patient.findOne({ patientId });
//     if (!patient) throw new APIError('Patient not found', 404);

//     // Validate OTP
//     if (patient.otp !== otp) throw new APIError('Invalid OTP', 400);

//     const isExpired = Date.now() > patient.otpExpiration;
//     if (isExpired) throw new APIError('OTP expired', 400);

//     // Clear OTP after successful validation
//     await Patient.updateOne({ patientId }, { $unset: { otp: 1, otpExpiration: 1 } });

//     res.status(200).json(new APIResponse(true, 'OTP verified successfully', { patientDetails: patient.details }));
// });
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);


const sendOtpForPatientId = asyncHandler(async (req, res) => {
    const { patientId } = req.body;
    if (!patientId) throw new ApiError('Patient ID is required', 400);

    console.log("\n\n" + patientId + "\n\n");

    // Step 1: Fetch patient email from FHIR API or MongoDB
    let email;
    try {
        const apiResponse = await axios.get(`http://hapi.fhir.org/baseR4/Patient/${patientId}`);
        const patientData = apiResponse.data;

        console.log("\n\n" + patientData + "\n\n");

        email = patientData.telecom?.[0]?.value; // Extract email
        const contact= patientData.telecom?.[1]?.value;
        console.log("n\nemail=" + email + "\n\n")

        if (!email) throw new ApiError(500, "Email not found in FHIR API data ");

        // Save data in MongoDB if not already present
        const existingPatient = await Patient.findOne({ patientId });
        if (!existingPatient) {
            await Patient.create({
                patientId,
                name: patientData.name?.[0]?.given+patientData.name?.[0]?.family || 'Unknown',
                dob: patientData.birthDate || 'N/A',
                email,
                contact,
                details: patientData,
            });
        }

        // Step 2: Generate and send OTP
        const otp = generateOTP();
        const mailMessage = `Your OTP for Patient ID verification is: ${otp}`;
        await sendMail(email, 'Patient ID Verification', mailMessage);

        // Save OTP and expiration in MongoDB (temporary storage)
        await Patient.updateOne(
            { patientId },
            { $set: { otp, otpExpiration: Date.now() + 5 * 60 * 1000 } }
            // OTP valid for 5 minutes
        );

        res.status(200).json(new ApiResponse(200, { patientId }, 'OTP sent successfully'));

    } catch (error) {
        console.error('FHIR API Error:', error.message);
        // Fallback to MongoDB if FHIR API fails
        const patientFromDb = await Patient.findOne({ patientId });
        if (!patientFromDb) throw new ApiError(404, "Patient not found in both FHIR API and MongoDB ");
        email = patientFromDb.email;
        if (!email) throw new ApiError(400, "Email not found in local database ");
        // Move the sendMail function call here
        const otp = generateOTP();
        const mailMessage = `Your OTP for Patient ID verification is: ${otp}`;
        await sendMail(email, 'Patient ID Verification', mailMessage);
    }
});



// const verifyOtpAndFetchData = asyncHandler(async (req, res) => {
//     const { patientId, otp } = req.body;

//     if (!patientId || !otp) throw new ApiError(400,'Patient ID and OTP are required');

//     // Fetch patient from MongoDB
//     const patient = await Patient.findOne({ patientId });
//     if (!patient) throw new ApiError(404,'Patient not found');

//     // Validate OTP
//     if (patient.otp !== otp) throw new ApiError(400,'Invalid OTP');

//     const isExpired = Date.now() > patient.otpExpiration;
//     if (isExpired) throw new ApiError(400,'OTP expired');

//     // Clear OTP after successful validation
//     await Patient.updateOne({ patientId }, { $unset: { otp: 1, otpExpiration: 1 } });

//     // Fetch patient data (from FHIR API or MongoDB if API is down)
//     let patientData;
//     try {
//         const apiResponse = await axios.get(`http://hapi.fhir.org/baseR4/Patient/${patientId}`);
//         patientData = apiResponse.data;
//     } catch (error) {
//         console.error('FHIR API Error:', error.message);
//         patientData = patient;
//     }

//     res.status(200).json(new ApiResponse(200, { patientDetails: patientData }, 'Patient data fetched successfully'));
// });


//DOB-FORMAT 1990-01-01

const verifyOtpAndFetchData = asyncHandler(async (req, res) => {

    const { patientId, otp } = req.body;
    let userId=req.user._id;
    if (!patientId || !otp || !userId) throw new ApiError(400, 'Patient ID, OTP, and User ID are required');

    // Fetch patient from MongoDB
    const patient = await Patient.findOne({ patientId });
    if (!patient) throw new ApiError(404, 'Patient not found');

    // Validate OTP
    if (patient.otp !== otp) throw new ApiError(400, 'Invalid OTP');

    const isExpired = Date.now() > patient.otpExpiration;
    if (isExpired) throw new ApiError(400, 'OTP expired');

    // Clear OTP after successful validation
    await Patient.updateOne({ patientId }, { $unset: { otp: 1, otpExpiration: 1 } });

    // Fetch user from MongoDB
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    // Add patientId to user's patient_ids array if not already present
    if (!user.patient_ids.includes(patientId)) {
        await User.updateOne(
            { _id: userId },
            { $addToSet: { patient_ids: patientId } } // Ensures no duplicates
        );
    }

    // Fetch patient data (from FHIR API or MongoDB if API is down)
    let patientData;
    try {
        const apiResponse = await axios.get(`http://hapi.fhir.org/baseR4/Patient/${patientId}`);
        patientData = apiResponse.data;
    } catch (error) {
        console.error('FHIR API Error:', error.message);
        patientData = patient;
    }

    res.status(200).json(new ApiResponse(200, { patientDetails: patientData }, 'Patient data fetched and verified successfully'));
});



const createPatientId = asyncHandler(async (req, res) => {
    const { name, email, dob, contact } = req.body;

    if (!name || !email || !dob || !contact) {
        throw new ApiError('All fields (name, email, dob, contact) are required', 400);
    }

    let patientId;

    try {
        const fhirPayload = {
            resourceType: 'Patient',
            name: [{ given: [name.split(' ')[0]], family: name.split(' ')[1] || '' }],
            telecom: [
                { system: 'email', value: email, use: 'home' },
                { system: 'phone', value: contact, use: 'mobile' }
            ],
            birthDate: dob
        };

        const fhirResponse = await axios.post('http://hapi.fhir.org/baseR4/Patient', fhirPayload);
        patientId = fhirResponse.data.id;

        if (!patientId) {
            throw new ApiError(400, 'Failed to create patient ID in FHIR API');
        }
    } catch (error) {
        console.error('FHIR API Error:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to create patient ID in FHIR API');
    }

    const newPatient = new Patient({
        patientId,
        name,
        email,
        dob,
        contact,
        details: {}
    });

    await newPatient.save();

    const mailMessage = `Your new Patient ID is: ${patientId}`;
    await sendMail(email, mailMessage, 'Patient ID Creation Successful');

    res.status(201).json(new ApiResponse(201, { patientId }, 'Patient ID created successfully'));
});







//45517689

// const uploadMedicalDetails = asyncHandler(async (req, res) => {
//     const { patientId, description } = req.body;
//     console.log("\n\n"+patientId+"\n\n");
//     console.log("\n\n"+description+"\n\n");
//     if (!patientId || !req.file || !description) {
//         throw new ApiError(400, 'Patient ID, description, and file are required');
//     }
//     const patient = await Patient.findOne({ patientId });
//     if (!patient) {
//         throw new ApiError(404, 'Patient not found');
//     }
//     const localFilePath = req.file.path;
//     //const uniqueFileName = `${uuidv4()}-${req.file.originalname}`;

//     try {
//         // Upload the file to Cloudinary
//         const uploadResponse = await uploadOnCloudinary(localFilePath);
//         if (!uploadResponse) {
//             throw new ApiError(500, 'Failed to upload file to Cloudinary');
//         }

//         const fileUrl = uploadResponse.url;

//         // Update MongoDB with the uploaded file details
//         await Patient.updateOne(
//             { patientId },
//             {
//                 $push: {
//                     medicalDetails: {
//                         patientId,
//                         fileUrl,
//                         description,
//                         uploadedAt: new Date(),
//                     },
//                 },
//             }
//         );

//         // Add the file to the FHIR API under 'medicalFiles'
//         const fhirData = {
//             resourceType: 'Patient',
//             id: patientId,
//             medicalFiles: [
//                 ...(patient.medicalDetails || []), // Preserve existing files
//                 {
//                     url: fileUrl,
//                     title: description,
//                 },
//             ],
//         };

//         try {
//            const response = await axios.put(`http://hapi.fhir.org/baseR4/Patient/${patientId}`, fhirData);
//             const updatedPatient = response.data;
//             console.log(updatedPatient);

//         } catch (error) {
//             console.error('FHIR API upload failed:', error.message);

//             // Save failed upload to retry queue
//             await FailedUploads.create({
//                 patientId,
//                 fileUrl,
//                 description,
//                 retryCount: 0,
//             });
//         }

//         // Clean up local file after successful upload
//         fs.unlinkSync(localFilePath);

//         res.status(200).json(new ApiResponse(200, { fileUrl }, 'Medical details uploaded successfully'));
//     } catch (error) {
//         console.error('Error uploading medical details:', error.message);

//         // Clean up local file on failure
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         throw new ApiError(500, 'Failed to upload medical details');
//     }
// });





const uploadMedicalDetails = asyncHandler(async (req, res) => {
    const { patientId, description } = req.body;

    // Log inputs for debugging
    console.log("\n\n" + patientId + "\n\n");
    console.log("\n\n" + description + "\n\n");

    // Check for required fields
    if (!patientId || !req.file || !description) {
        throw new ApiError(400, 'Patient ID, description, and file are required');
    }

    // Fetch patient from MongoDB
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
        throw new ApiError(404, 'Patient not found');
    }

    const localFilePath = req.file.path;
    
    try {
        // Upload the file to Cloudinary
        const uploadResponse = await uploadOnCloudinary(localFilePath);
        if (!uploadResponse) {
            throw new ApiError(500, 'Failed to upload file to Cloudinary');
        }

        const fileUrl = uploadResponse.url;

        // Update MongoDB with the uploaded file details
        await Patient.updateOne(
            { patientId },
            {
                $push: {
                    medicalDetails: {
                        patientId,
                        fileUrl,
                        description,
                        uploadedAt: new Date(),
                    },
                },
            }
        );

        // Fetch the current FHIR Patient resource to avoid overwriting existing extensions
        let fhirPatient;
        try {
            const fhirResponse = await axios.get(`http://hapi.fhir.org/baseR4/Patient/${patientId}`);
            fhirPatient = fhirResponse.data;
        } catch (error) {
            console.error('Failed to fetch existing FHIR Patient resource:', error.message);
            fhirPatient = { resourceType: 'Patient', id: patientId, extension: [] }; // Fallback if not found
        }

        // Append the new medical file to the existing extension array
        const newMedicalFile = {
            url: fileUrl,
            title: description,
        };

        fhirPatient.extension = fhirPatient?.extension || []; // Ensure extensions exist
        fhirPatient.extension.push({
            url: 'http://example.org/fhir/StructureDefinition/medicalFiles', // Custom extension URL
            valueAttachment: {
                contentType: req?.file?.mimetype, // You can dynamically set this based on the file type
                url: fileUrl,
                title: description,
            },
        });

        // Update the FHIR Patient resource with the appended data
        try {
            const response = await axios.put(`http://hapi.fhir.org/baseR4/Patient/${patientId}`, fhirPatient);
            const updatedPatient = response.data;
            console.log(updatedPatient);
        } catch (error) {
            console.error('FHIR API upload failed:', error.message);

            // Save failed upload attempt for retry
            await FailedUploads.create({
                patientId,
                fileUrl,
                description,
                retryCount: 0,
            });
        }

        // Clean up the local file after the upload is done
        fs.unlinkSync(localFilePath);

        // Respond with success
        res.status(200).json(new ApiResponse(200, { fileUrl }, 'Medical details uploaded successfully'));
    } catch (error) {
        console.error('Error uploading medical details:', error.message);

        // Clean up the local file on failure
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw new ApiError(500, 'Failed to upload medical details');
    }
});







export {
    loginUser,
    registerUser,
    nearestHospital,
    nearestPharmacy,
    getAllHospitals,
    getAvailableSlots,
    bookAppointment,
    updateAppointment,
    deleteAppointment,
    getAllDoctors,
    sendOtpForPatientId,
    verifyOtpAndFetchData,
    createPatientId,
    getCurrentUser,
    logoutUser,
    uploadMedicalDetails ,

}
