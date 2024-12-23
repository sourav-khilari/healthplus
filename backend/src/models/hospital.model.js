import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    firebaseUid: {
        type: String
    }, // Set only when approved
    password: {
        type: String
    }, // Set only when approved
    role:{
        type:String,
        default:"hospital",
    }
}, {
    timestamps: true
});

export const Hospital = mongoose.model('Hospital', hospitalSchema);


