import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/VideoIdPage.css"; // Import custom styles

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
        console.log(error);
      }
    };

    fetchVideoId();
  }, [appointmentId]);

  return (
    <div className="video-id-container">
      <div className="video-id-content">
        <h1 className="title">Video Consultation Details</h1>
        <div className="video-id-box">
          <h3 className="subtitle">Video ID</h3>
          <p className="video-id">
            {videoId ? (
              videoId
            ) : (
              <span className="loading-text">Loading...</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoIdPage;
