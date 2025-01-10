// const admin = require('firebase-admin');
//const serviceAccount = require('./firebase-service-account.json');
import admin from 'firebase-admin'
//import serviceAccount from './firebase-service-account.json'

//const serviceAccount = await import('./firebase-service-account.json', { assert: { type: 'json' } } );
let serviceAccount;
if (process.env.NODE_ENV === 'deployment') {
    // In production, use environment variables
    serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_ADMIN_SDK, 'base64').toString('utf8')
    );
} else {
    // In development, use the local JSON file
    //serviceAccount = await import('./firebase-service-account.json', { assert: { type: 'json' } });
    serviceAccount = (await import('./firebase-service-account.json', { assert: { type: 'json' } })).default;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export {
    admin
}
