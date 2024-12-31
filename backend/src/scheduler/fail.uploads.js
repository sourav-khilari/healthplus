import cron from 'node-cron';
import axios from 'axios';
import { FailedUploads } from '../models/failed.upload.model.js';
import { Patient } from "../models/patient.model.js";

export const failedUploads = () => {
    cron.schedule('*/15 * * * *', async () => {
        console.log('Retrying failed FHIR API uploads...');

        const failedUploads = await FailedUploads.find();
        for (const upload of failedUploads) {
            try {
                const patientId=upload.Patient;
                const patient = await Patient.findOne({ patientId });
                if (!patient) {
                    // Remove failed upload if patient not found
                    await FailedUploads.deleteOne({ _id: upload._id });
                    console.log(`Patient not found. Removed failed upload for Patient ID: ${patientId}`);
                    continue;
                  }
          
                const fhirData = {
                    resourceType: 'Patient',
                    id: upload.patientId,
                    medicalFiles: [
                        {
                            ...(patient.medicalDetails || []),
                            url: upload.fileUrl,
                            title: upload.description,
                        },
                    ],
                };

                await axios.put(`http://hapi.fhir.org/baseR4/Patient/${upload.patientId}`, fhirData);
                console.log(`Successfully uploaded to FHIR API for Patient ID: ${upload.patientId}`);

                // Remove successful retry
                await FailedUploads.deleteOne({ _id: upload._id });
            } catch (error) {
                console.error(`Retry failed for Patient ID: ${upload.patientId}`, error.message);

                // Increment retry count
                await FailedUploads.updateOne(
                    { _id: upload._id },
                    { $inc: { retryCount: 1 } }
                );
            }
        }
    })
};
