import express from "express";
import cors from "cors";
// Parse cookies in browser requests
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import {
  MessageModel,
  ConversationModel
} from "./models/ConversationModel.js"

import {
  getConversation
} from "./helpers/getConversation.js"

// Initialize Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    method:["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
  })
);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS","PATCH"],
    credentials: true,
  },
});

// Middleware for parsing requests
app.use(express.json({ limit: "36kb" })); // JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // URL-encoded payloads
app.use(express.static("public")); // Serve static files
app.use(cookieParser()); // Cookie parsing

// Socket.IO connection handler
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const onlineUser = new Set()


io.on("connection", async (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });


  socket.on("end-call", ({ from, to }) => {
    io.to(to).emit("end-call", { from, to });
  });

  socket.on("call-ended", ({ from, to }) => {
    // const [from, to] = caller;
    io.to(from).emit("call-ended", { from, to });
    io.to(to).emit("call-ended", { from, to });
  })

  console.log("connect User ", socket.id)

 


  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  })

});



// Disconnect handler



// Import and use routes
import userRouter from "./routes/user.router.js";
import adminRouter from "./routes/sub.admin.route.js";
import superadminRouter from "./routes/admin.route.js";
import hospitalRouter from "./routes/hospital.route.js";
import doctorRouter from "./routes/doctor.route.js";
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });



app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/superadmin", superadminRouter);
app.use("/api/v1/doctor", doctorRouter);

// Import and execute schedulers
import { failedUploads } from "./scheduler/fail.uploads.js";
import { pendingHospitalScheduler } from "./scheduler/reminder.hospital.js";

pendingHospitalScheduler();

// Export the app for external use
export { app, server, io };
