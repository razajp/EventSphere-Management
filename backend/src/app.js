import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import expoRoutes from "./routes/expoRoutes.js";
import exhibitorRoutes from "./routes/exhibitorRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/exhibitor", exhibitorRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendee", attendeeRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("EventSphere Backend is Live ✅");
});

export default app;
