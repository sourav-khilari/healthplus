import express from "express"
import cors from "cors"
//cud in cokies of browser by server
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//accept json
app.use(express.json({limit: "16kb"}))
//accept url encoded
app.use(express.urlencoded({extented:true,limit:"16kb"}))
//file,folder,public folder assets
app.use(express.static("public"))
//cud in cokies of browser by server
app.use(cookieParser())

//routes import
//import userRouter from './routes/user.router.js'

//routes decalaration
//app.use("/api/v1/users",userRouter)



export {app}