import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
<<<<<<< HEAD
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Db connection failed!!!", err);
  });
=======
.then(()=>{
    app.on("error",(error )=>{
        console.log("ERROR:",error);
        throw error
    })
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo Db connection failed!!!",err);
    
})
>>>>>>> dc6a2930dac869f91701bf5fc457a5ae53f69614
