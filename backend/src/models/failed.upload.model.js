import mongoose from 'mongoose';

const failedUploadsSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true },
    retryCount: { type: Number, default: 0 },
});

export const FailedUploads = mongoose.model('FailedUploads', failedUploadsSchema);
