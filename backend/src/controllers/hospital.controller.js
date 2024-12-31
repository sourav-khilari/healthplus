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


// const addDoctor = async (req, res) => {
//     const { name, department, speciality, email, phone, availability,slotDuration } = req.body;
//     const hospitalId=req.user._id;
//     try {
//         // Create a Google Calendar for the doctor
//         const calendarResponse = await calendar.calendars.insert({
//             requestBody: {
//                 summary: `${name} - ${department}`,
//                 description: `Calendar for Dr. ${name} (${speciality})`,
//             },
//         });

//         // Save doctor details in MongoDB
//         const newDoctor = new Doctor({
//             name,
//             department,
//             speciality,
//             email,
//             phone,
//             hospitalId,
//             calendarId: calendarResponse.data.id,
//             availability,
//             slotDuration,
//         });

//         await newDoctor.save();
//         return res.status(200).json(new ApiResponse(200,{ doctor: newDoctor}, 'Doctor added successfully'));
//     } catch (error) {
//         throw new ApiError(500, 'Failed to add doctor:',error.message);
//     }
// };

// GET /api/hospitals/:hospitalId/appointments

const generateRandomPassword = (length = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

const addDoctor = async (req, res) => {
    const { name, department, speciality, email, phone, availability, slotDuration } = req.body;
    const hospitalId = req.user._id;

    try {
        // Generate a random password for the doctor
        const password = generateRandomPassword();

        // Create a Google Calendar for the doctor
        const calendarResponse = await calendar.calendars.insert({
            requestBody: {
                summary: `${name} - ${department}`,
                description: `Calendar for Dr. ${name} (${speciality})`,
            },
        });

        // Save doctor details in Firebase for authentication
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: `Dr. ${name}`,
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
            slotDuration,
            password, // Save the password
            firebaseUid: firebaseUser.uid, // Save the Firebase UID
        });

        await newDoctor.save();

        // Send an email to the doctor with their credentials
        const emailSubject = `Welcome to Our Hospital Platform`;
        const emailMessage = `
            Dear Dr. ${name},

            Congratulations on joining our hospital team as a specialist in ${speciality}.
            
            Here are your login credentials for our platform:
            Email: ${email}
            Password: ${password}
            
            Please log in to the platform to set up your profile and manage your appointments.

            Best Regards,
            Hospital Admin Team 
        `;

        await sendEmail(email, emailSubject, emailMessage);

        return res.status(200).json(new ApiResponse(200, { doctor: newDoctor }, 'Doctor added successfully'));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to add doctor:', error.message);
    }
};






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
        console.log('\n\nDoctor IDs:', doctorIds+"\n\n");

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
        if(!doctorId){
            throw new ApiError(404, 'Doctor id is not there');
        }
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




const verifyOtpAndFetchData = asyncHandler(async (req, res) => {

    const { patientId, otp } = req.body;
    //let userId=req.user._id;
    if (!patientId || !otp ) throw new ApiError(400, 'Patient ID, OTP, and User ID are required');

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
    // const user = await User.findById(userId);
    // if (!user) throw new ApiError(404, 'User not found');

    // Add patientId to user's patient_ids array if not already present
    // if (!user.patient_ids.includes(patientId)) {
    //     await User.updateOne(
    //         { _id: userId },
    //         { $addToSet: { patient_ids: patientId } } // Ensures no duplicates
    //     );
    // }

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

    // Step 2: Add patientId to user's patient_ids array
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
            if (error.response.status === 500) {
                console.log('Update successful, but server unable to return updated resource');
              } else {
                console.error('FHIR API upload failed:', error.message);
                // Save failed upload attempt for retry
                await FailedUploads.create({
                  patientId,
                  fileUrl,
                  description,
                  retryCount: 0,
                });
              }
            
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

const updateHospitalAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

 

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateHospitalCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


export {
    registerHospital,
    loginHospital,
    addDoctor,
    getHospitalAllAppointments,
    getDoctorAppointments,
    getCurrentUser,
    logoutUser,
    uploadMedicalDetails,
    getPatientDetailsId,
    createPatientId,
    verifyOtpAndFetchData,
    fetchPatientData,
    updateHospitalAvatar,
    updateHospitalCoverImage,
}