import { useState, useEffect } from "react";
import axios from "axios";
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

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Prevent infinite retries

        try {
          const auth = await getAuth();
          if (!auth.currentUser) {
            console.log("User is not authenticated. Please log in again.");
            // Handle unauthenticated user case
            return Promise.reject(error);
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
          console.log("interceptor");
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
      const response = await axiosInstance.get(
        `/hospitals?lat=${lat}&lng=${lng}`
      );
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Nearby Hospital Locator
      </h1>

      {loading && (
        <div className="text-center text-xl text-gray-500">
          Loading your location and nearby hospitals...
        </div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="space-y-6 mt-6">
        {hospitals.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-500">
            No hospitals found nearby.
          </p>
        )}

        {hospitals.map((hospital, index) => {
          const { name, address_line1, address_line2, contact } =
            hospital.properties;
          const lat = hospital.geometry.coordinates[1];
          const lng = hospital.geometry.coordinates[0];

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                {name || "Unknown Hospital"}
              </h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {address_line1 || "Not available"},{" "}
                {address_line2 || ""}
              </p>
              <p className="text-gray-600">
                <strong>Contact:</strong> {contact || "Not available"}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Get Directions
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindHospital;
