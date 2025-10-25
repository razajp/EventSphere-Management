import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getExhibitorStats, completeProfile } from "../controllers/exhibitorController.js";

const router = express.Router();


// Exhibitor stats route
router.get(
  "/stats",
  protect,
  authorizeRoles("exhibitor"),
  getExhibitorStats
);

router.post(
  "/profile-setup",
  protect,
  authorizeRoles("exhibitor"),
  completeProfile
);

export default router;
