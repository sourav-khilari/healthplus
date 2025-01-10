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
    method:["GET","POST","PUT","DELETE"],
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

  //const token = socket.handshake.auth.token 
  //console.log("connect User token 12", token)

  //current user details    
  const user = await getUserDetailsFromToken(token)
  //const user = ""; 
  console.log("connect User after user ", socket.id)

  if (user.message == "session out") {
    console.error("User not found or token is invalid");
    //socket.emit('error', { message: "Authentication failed" });
    return socket.disconnect(true); // Disconnect the socket
  }
  //
  // socket.join(user?._id.toString())
  io.emit('onlineUser', Array.from(onlineUser))

  socket.on('message-page', async (userId) => {
    console.log('userId', userId)
    const userDetails = await User.findById(userId).select("-password")

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.avatar,
      online: onlineUser.has(userId)
    }
    socket.emit('message-user', payload)


    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ]
    }).populate('messages').sort({ updatedAt: -1 })

    socket.emit('message', getConversationMessage?.messages || [])
  })


  //new message
  socket.on('new message', async (data) => {

    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    })

    //if conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver
      })
      conversation = await createConversation.save()
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    })
    const saveMessage = await message.save()

    const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
      "$push": { messages: saveMessage?._id }
    })

    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    }).populate('messages').sort({ updatedAt: -1 })


    io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
    io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

    //send conversation
    const conversationSender = await getConversation(data?.sender)
    const conversationReceiver = await getConversation(data?.receiver)

    io.to(data?.sender).emit('conversation', conversationSender)
    io.to(data?.receiver).emit('conversation', conversationReceiver)
  })


  //sidebar
  socket.on('sidebar', async (currentUserId) => {
    console.log("current user", currentUserId)

    const conversation = await getConversation(currentUserId)

    socket.emit('conversation', conversation)

  })

  socket.on('seen', async (msgByUserId) => {

    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id }
      ]
    })

    const conversationMessageId = conversation?.messages || []

    const updateMessages = await MessageModel.updateMany(
      { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
      { "$set": { seen: true } }
    )

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString())
    const conversationReceiver = await getConversation(msgByUserId)

    io.to(user?._id?.toString()).emit('conversation', conversationSender)
    io.to(msgByUserId).emit('conversation', conversationReceiver)
  })



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
