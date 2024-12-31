import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    patientName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', required: true
    },
    patient_id:{
        type:String
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    //hospitalId:{type:String},
    date: {
        type: Date,
        required: true
    },
    //timeSlot: { type: String, required: true },
    timeSlot: {
        type: {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'rescheduled', 'canceled'],
        default: 'booked'
    },
    calendarEventId: {
        type: String
    }, // Google Calendar event ID
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
