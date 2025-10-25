import express from "express";
import { getOrganizerExpos, handleExhibitorRequest } from "../controllers/organizerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/expos", protect, getOrganizerExpos);
router.post("/exhibitor-request", protect, handleExhibitorRequest);

export default router;
