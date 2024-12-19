// const admin = require('firebase-admin');
//const serviceAccount = require('./firebase-service-account.json');
import admin from 'firebase-admin'
//import serviceAccount from './firebase-service-account.json'

const serviceAccount = await import('./firebase-service-account.json', { assert: { type: 'json' } } );


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
});

export {
    admin
}
