// import { useState, useEffect } from "react";
// import "../styles/FindHospital.css"; // Optional styling file
// import axios from "axios"

// const FindHospital = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:8000/api/v1/users", // Backend API URL
//     withCredentials: true, // Handle cookies
//   });

//   // Function to get the user's location and fetch nearby hospitals
//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
//           console.log("lat=" + lat + "\n" + "lng=" + lng);
//           fetchHospitals(lat, lng); // Fetch hospitals once location is available
//         },
//         (error) => {
//           setLoading(false);
//           setError("Error getting location.");
//           console.error("Error getting location:", error);
//         }
//       );
//     } else {
//       setLoading(false);
//       setError("Geolocation is not supported by this browser.");
//     }
//   };

//   // Function to fetch hospitals based on user's latitude and longitude
//   const fetchHospitals = async (lat, lng) => {
//     try {
//       const response = await axiosInstance.get(
//         `/hospitals?lat=${lat}&lng=${lng}`,
//       );
//       // const data = await response.json();
//       console.log(response+"\n\n");
//       console.log(JSON.stringify(response, null, 2) + "\n\n");

//       console.log()
      
//       //console.log(data+"\n\n")
//       setHospitals(response.data); // Set fetched hospital data to state
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       setError("Error fetching hospitals.");
//       console.error("Error fetching hospitals:", error);
//     }
//   };

//   // Fetch user's location on component mount
//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   return (
//     <div className="find-hospital-page">
//       <h1>Nearby Hospital Locator</h1>
//       {loading && (
//         <div id="loading">Loading your location and nearby hospitals...</div>
//       )}
//       {error && <div id="error">{error}</div>}

//       <div id="hospital-list">
//         {hospitals.length === 0 && !loading && !error && (
//           <p>No hospitals found nearby.</p>
//         )}
//         {hospitals.map((hospital, index) => {
//           const { name, address_line1, address_line2, contact } =
//             hospital.properties;
//           const lat = hospital.geometry.coordinates[1];
//           const lng = hospital.geometry.coordinates[0];

//           return (
//             <div key={index} className="hospital">
//               <h2>{name || "Unknown Hospital"}</h2>
//               <p>
//                 <strong>Address:</strong> {address_line1 || "Not available"},{" "}
//                 {address_line2 || ""}
//               </p>
//               <p>
//                 <strong>Contact:</strong> {contact || "Not available"}
//               </p>
//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Get Directions
//               </a>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };



// import { getAuth } from "firebase/auth";


import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FindHospital.css";
import { getAuth } from "firebase/auth";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Axios instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1/users", // Backend API URL
    withCredentials: true, // Include cookies
  });

  // Attach Axios interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check for token expiration error
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite retries

        try {
          const auth = await getAuth();
          if (!auth.currentUser) {
            console.log("User is not authenticated. Please log in again.");
            //return Promise.reject(error);
          }
          const newIdToken = await auth.currentUser.getIdToken(true); // Force refresh the token

          // Call refreshToken API to update token in cookies
          await axios.post(
            "http://localhost:8000/api/v1/users/auth/refreshToken", // Refresh token API endpoint
            {},
            {
              headers: {
                Authorization: `Bearer ${newIdToken}`,
              },
              withCredentials: true,
            }
          );

          // Retry the original request with updated cookies
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setError("Session expired. Please log in again.");
        }
      }

      return Promise.reject(error);
    }
  );

  // Function to fetch hospitals
  const fetchHospitals = async (lat, lng) => {
    try {
      const response = await axiosInstance.get(`/hospitals?lat=${lat}&lng=${lng}`);
      console.log(JSON.stringify(response, null, 2) + "\n\n");

      setHospitals(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching hospitals.");
      console.error("Error fetching hospitals:", error);
    }
  };

  // Get user's location and fetch hospitals
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          fetchHospitals(lat, lng);
        },
        (error) => {
          setLoading(false);
          setError("Error getting location.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="find-hospital-page">
      <h1>Nearby Hospital Locator</h1>
      {loading && <div id="loading">Loading your location and nearby hospitals...</div>}
      {error && <div id="error">{error}</div>}
      <div id="hospital-list">
        {hospitals.length === 0 && !loading && !error && <p>No hospitals found nearby.</p>}
        {hospitals.map((hospital, index) => (
          <div key={index} className="hospital">
            <h2>{hospital.properties.name || "Unknown Hospital"}</h2>
            <p>
              <strong>Address:</strong> {hospital.properties.address_line1 || "Not available"},{" "}
              {hospital.properties.address_line2 || ""}
            </p>
            <p>
              <strong>Contact:</strong> {hospital.properties.contact || "Not available"}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.geometry.coordinates[1]},${hospital.geometry.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindHospital;

