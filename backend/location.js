import express from "express"
import axios from "axios";
import cors from "cors"
//const axios = require("axios");
//const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;
const GEOAPIFY_API_KEY = "1fbb9d4b37744f8086172d1358dba01b"; 

// Endpoint to get nearby hospitals
app.get("/api/hospitals", async (req, res) => {
  const { lat, lng } = req.query; // Latitude and Longitude from the query

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and Longitude are required." });
  }
  console.log("lat="+lat+"\n"+"lan="+lng);
  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},15000&limit=10&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const response = await axios.get(url);
    //console.log(response);
    res.json(response.data.features); // Return hospital data
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: "Failed to fetch hospital data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
