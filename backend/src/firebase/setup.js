// //Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth,GoogleAuthProvider} from "firebase/auth"
// import {getFirestore} from "firebase/firestore"
// import { getStorage } from "firebase/storage"; 

// const firebaseConfig = {
//   apiKey: "AIzaSyB2sKWEJUe8lN3KSaC7Z4SvMVJI8AMvT7U",
//   authDomain: "mychatt-6cf4e.firebaseapp.com",
//   projectId: "mychatt-6cf4e",
//   storageBucket: "mychatt-6cf4e.appspot.com",
//   messagingSenderId: "282770822965",
//   appId: "1:282770822965:web:9875fd3a6c80cd6ed81e7c"
// };

// // // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app)
// export const googleProvider = new GoogleAuthProvider(app)
// export const database = getFirestore(app)
// export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ9L91dE5EIVqH2QJNZiNsyObiiBmGuHo",
  authDomain: "healthplus-a7bd7.firebaseapp.com",
  projectId: "healthplus-a7bd7",
  storageBucket: "healthplus-a7bd7.firebasestorage.app",
  messagingSenderId: "18341081891",
  appId: "1:18341081891:web:9eedc02c6d5a064ed81296",
  measurementId: "G-6D223N3RLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)
export const database = getFirestore(app)
export const storage = getStorage(app);