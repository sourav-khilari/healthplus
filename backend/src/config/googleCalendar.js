// import {google} from 'googleapis'
// import path from 'path'

import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const calendar = google.calendar({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
        keyFile:  path.join(__dirname, '..', 'config', 'service-account.json'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
    }),
});

export {
    calendar,
}
