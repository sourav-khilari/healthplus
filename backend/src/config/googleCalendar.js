import {google} from 'googleapis'
import path from 'path'

// const { google } = require('googleapis');
// const path = require('path');

const calendar = google.calendar({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
        keyFile:  'service-account.json',
        scopes: ['https://www.googleapis.com/auth/calendar'],
    }),
});

export {
    calendar,
}
