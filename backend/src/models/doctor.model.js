import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    speciality: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    calendarId: { type: String }, // Google Calendar ID
    availability: [
        {
            day: { type: String, required: true }, // e.g., "Monday"
            startTime: { type: String, required: true }, // e.g., "09:00"
            endTime: { type: String, required: true }, // e.g., "17:00"
        },
    ],
    slotDuration: Number, // In minutes, e.g., 30
    password: { type: String, required: true }, // Store the password
    firebaseUid: { type: String, required: true }, // Store the Firebase UID
    role: {
        type: String,
        default: "doctor",
      },
},{
    timestamps: true,
});

export const Doctor = mongoose.model('Doctor', doctorSchema);
