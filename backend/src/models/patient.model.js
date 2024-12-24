import mongoose, { Schema } from "mongoose";

const patientSchema = mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dob: { type: String },
    email: { type: String },
    contact: { type:String } ,
    details: { type: Object },
    otp: { type: String },
    otpExpiration: { type: Date },
}, { timestamps: true });

export const Patient= mongoose.model('Patient', patientSchema);
