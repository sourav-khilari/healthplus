import cron from 'node-cron'
import nodemailer from "../utils/sendEmail.js"
import { Hospital } from "../models/hospital.model.js";


const pendingHospitalScheduler = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            const pendingHospitals = await Hospital.find({ status: 'pending' });

            if (pendingHospitals.length > 0) {
                const adminEmail = 'souravkhilari123456@gmail.com'; // Replace with the actual admin email
                const message = `
                You have ${pendingHospitals.length} pending hospital registration requests.
                Please review them as soon as possible.
            `;
                await nodemailer(adminEmail, 'Pending Hospital Requests', message);
            }
        } catch (error) {
            console.error('Failed to send pending requests reminder:', error.message);
        }
    })
};

export {
    pendingHospitalScheduler,
}