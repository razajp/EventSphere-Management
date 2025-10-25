import express from "express";
import {
  getSessionsByExpo,
  createSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Organizer only
router.get("/:expoId", protect, getSessionsByExpo);
router.post("/:expoId", protect, createSession);
router.put("/:id", protect, updateSession);
router.delete("/:id", protect, deleteSession);

export default router;
