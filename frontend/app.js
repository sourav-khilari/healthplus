// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getIdToken } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Firebase Config
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/users", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

// Email/Password Registration
document.getElementById("register-email").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
<<<<<<< HEAD
<<<<<<< HEAD
   // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   // const idToken = await getIdToken(userCredential.user);

    // Send data to backend
    const response = await axiosInstance.post("/register", {  email, password, name });
=======
    //const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //const idToken = await getIdToken(userCredential.user);

    // Send data to backend
    const response = await axiosInstance.post("/register", { email, password, name });
>>>>>>> dc6a2930dac869f91701bf5fc457a5ae53f69614
=======
    //const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //const idToken = await getIdToken(userCredential.user);

    // Send data to backend
    const response = await axiosInstance.post("/register", { email, password, name });
>>>>>>> dc6a2930dac869f91701bf5fc457a5ae53f69614
    console.log(response.data);
    alert("Registration successful");
  } catch (error) {
    console.error("Registration Error:", error.message);
    alert("Registration failed");
  }
});

// Email/Password Login
document.getElementById("login-email").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await getIdToken(userCredential.user);

    // Send data to backend
    const response = await axiosInstance.post("/login", { idToken });
    //console.log(response.data);
    alert("Login successful");
  } catch (error) {
    console.error("Login Error:", error.message);
    alert("Login failed");
  }
});

// Google Login/Registration
document.getElementById("google-login").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await getIdToken(result.user);

    // Send data to backend
    const response = await axiosInstance.post("/register", { idToken });
    console.log(response.data);
    alert("Google Login/Registration successful");
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    alert("Google Authentication failed");
  }
});
