import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../config/firebase.js";
import axios from "axios";
import { Hospital } from "../models/hospital.model.js";

// const registerUser = asyncHandler(async (req, res) => {
//     const { email, password, name, idToken } = req.body;
//     let firebaseUser;

//     try {
//         let createdUser;

//         if (idToken) {
//             // Google Registration
//             const decodedToken = await admin.auth().verifyIdToken(idToken);
//             const { uid, email: firebaseEmail, name: firebaseName } = decodedToken;

//             // Check if the user exists in Firebase
//             firebaseUser = await admin.auth().getUser(uid);
//             //console.log("\n\n" + JSON.stringify(firebaseUser, null, 2) + "\n\n");

//             if (!firebaseUser) {
//                 throw new ApiError(400, 'User not registered');
//             }

//             // Save to MongoDB if not already present
//             let user = await User.findOne({ firebaseUid: uid });
//             if (!user) {
//                 user = new User({
//                     firebaseUid: uid,
//                     email: firebaseEmail,
//                     name: firebaseName || firebaseEmail.split('@')[0],
//                     authMethod: 'google',
//                 });
//                 createdUser = await user.save();
//             }
//             else{
//                 throw new ApiError(500, `user already exist in mongodb`);
//             }
//         } else if (email && password) {
//             // Email/Password Registration
//             firebaseUser = await admin.auth().createUser({
//                 email,
//                 password,
//                 displayName: name,
//             });

//             // Save to MongoDB
//             let user = new User({
//                 firebaseUid: firebaseUser.uid,
//                 email,
//                 name,
//                 authMethod: 'email/password',
//             });
//             createdUser = await user.save();
//         } else {
//             throw new ApiError(400, 'Invalid registration request');
//         }

//         return res.status(201).json(
//             new ApiResponse(201, createdUser, 'User registered successfully')
//         );
//     } catch (error) {
//         // Ensure Firebase cleanup on any error
//         if (firebaseUser && firebaseUser.uid) {
//             await admin.auth().deleteUser(firebaseUser.uid).catch((cleanupError) => {
//                 console.error('Error cleaning up Firebase user:', cleanupError.message);
//             });
//         }
//         throw new ApiError(500, `Registration failed: ${error.message}`);
//     }
// });


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





// const login = asyncHandler(async (req, res) => {
//     const { idToken, email } = req.body;
    
//     try {
//         let decodedToken;

//         if (idToken) {
//             // Google Login or Email/Password Login (handled via idToken)
//             decodedToken = await admin.auth().verifyIdToken(idToken);
//         } else {
//             throw new ApiError(400, 'Invalid login request');
//         }

//         const { uid } = decodedToken;

//         // Check if the user exists in MongoDB
//         const user = await User.findOne({ firebaseUid: uid });
//         if (!user) {
//             throw new ApiError(404, 'User not found in the database');
//         }
//         const option = {
//             httpOnly: true,
//             secure: true, // Set to true in production
//             maxAge: 24 * 60 * 60 * 1000, // 1 day
//         }
//         // Save token in cookies
//         res.cookie('authToken', idToken, option);

//        return res.status(200).json(new ApiResponse(200, user, 'Login successful'));
//     } catch (error) {
//         throw new ApiError(500, `Login failed: ${error.message}`);

//     }
// });


const login = asyncHandler(async (req, res) => {
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


const getAllHospitals = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            throw new ApiError(403, 'Access denied: Admins only');
        }

        const approvedHospitals = await Hospital.find({ status: 'approved' },'-password','status');

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



const nearestPharmacy=asyncHandler(async(req,res)=>{
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
       throw new ApiError(500, "Failed to fetch hospital data.",error);
       
     }
})


export {
    login,
    registerUser,
    nearestHospital,
    nearestPharmacy,
    getAllHospitals,
}
