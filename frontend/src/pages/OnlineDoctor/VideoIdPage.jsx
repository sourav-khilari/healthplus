import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const VideoIdPage = ({ appointmentId }) => {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const response = await axiosInstance.get(
          `/online doctor/onlinegetVideoId/${appointmentId}`
        );
        setVideoId(response.data.videoId);
      } catch (error) {
        alert("Failed to fetch video ID");
      }
    };

    fetchVideoId();
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Video Consultation Details
        </h1>

        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Video ID</h3>
          <p className="text-lg text-gray-600">{videoId || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoIdPage;
