import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createExpo, getExpos, updateExpo, deleteExpo, requestParticipation, getExposForExhibitor, getExposForAttendee, joinExpo, leaveExpo } from "../controllers/expoController.js";

const router = express.Router();

// Create Expo (Organizer only)
router.post("/", protect, createExpo);

// Get Expos (Public or filtered by organizer)
router.get("/", protect, getExpos);

router.get("/for-exhibitor", getExposForExhibitor);
router.get("/for-attendee", getExposForAttendee);

// Update Expo (Only owner)
router.put("/:id", protect, updateExpo);

router.delete("/:id", protect, deleteExpo);

router.post("/request/:id", protect, requestParticipation);

router.post("/join/:id", protect, joinExpo);

router.post("/leave/:id", protect, leaveExpo);

export default router;
