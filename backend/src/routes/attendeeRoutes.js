import express from "express";
import { getAttendeeStats, getSchedules, toggleFavorite } from "../controllers/attendeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getAttendeeStats);

router.get("/schedules", protect, getSchedules);

router.post("/favorites/:sessionId", protect, toggleFavorite);

export default router;
