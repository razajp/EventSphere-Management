import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  },
});

// Store online users
const onlineUsers = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online users:", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let key in onlineUsers) {
      if (onlineUsers[key] === socket.id) delete onlineUsers[key];
    }
  });
});

// Helper to send notifications
export const sendNotificationRealtime = (userId, notification) => {
  const socketId = onlineUsers[userId];
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
};

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
