import axios from "axios";

import { getAuth } from "firebase/auth";


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
                console.log("interceptor")
                // Retry the original request with updated cookies
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                //setError("Session expired. Please log in again.");
            }
        }

        return Promise.reject(error);
    }
);

export {
    axiosInstance,
}