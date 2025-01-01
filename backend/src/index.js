import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app,server } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Db connection failed!!!", err);
  });


  app.get("/api/config/paypal", (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  });
  