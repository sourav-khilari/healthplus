import { useState, useEffect } from "react";
import axios from "axios";

const VideoIdPage = ({ appointmentId }) => {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const response = await axios.get(
          `/api/v1/online doctor/onlinegetVideoId/${appointmentId}`
        );
        setVideoId(response.data.videoId);
      } catch (error) {
        alert("Failed to fetch video ID");
      }
    };

    fetchVideoId();
  }, [appointmentId]);

  return (
    <div>
      <h3>Video ID: {videoId}</h3>
    </div>
  );
};

export default VideoIdPage;
