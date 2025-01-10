// // import {google} from 'googleapis'
// // import path from 'path'

// import { google } from 'googleapis';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// const calendar = google.calendar({
//     version: 'v3',
//     auth: new google.auth.GoogleAuth({
//         keyFile:  path.join(__dirname, '..', 'config', 'service-account.json'),
//         scopes: ['https://www.googleapis.com/auth/calendar'],
//     }),
// });

// export {
//     calendar,
// }




import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let credentials;

if (process.env.NODE_ENV === 'deployment') {
    // Load credentials from the environment variable in production
    if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT environment variable is not set.");
    }
    credentials = JSON.parse(
        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString('utf8')
    );
} else {
    // Load credentials from the local file in development
    credentials = require(path.join(__dirname, '..', 'config', 'service-account.json'));
}

const calendar = google.calendar({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
    }),
});

export {
    calendar,
};
