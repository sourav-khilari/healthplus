import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // for page redirection
// import firebase from "firebase/app"; // only if you need this for older Firebase SDK
import "../styles/Login.css"
const Login = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to register page

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const redirectToRegister = () => {
    navigate("/register"); // navigate to the Register page
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {!user ? (
        <div>
          <button onClick={handleGoogleLogin} className="google-login-button">
            Sign in with Google
          </button>
          <p> Do not have an account?</p>
          <button onClick={redirectToRegister} className="register-button">
            Register Here
          </button>
        </div>
      ) : (
        <div className="user-info">
          <img src={user.photo} alt="User" className="user-photo" />
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
