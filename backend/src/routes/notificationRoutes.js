import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js"; // your auth middleware

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read/:id", protect, markAsRead);

export default router;
