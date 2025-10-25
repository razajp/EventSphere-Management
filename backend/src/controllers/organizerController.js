import Expo from "../models/Expo.js";
import Notification from "../models/Notification.js";
import { sendNotificationRealtime } from "../server.js";

// Get organizer's expos with exhibitor requests
export const getOrganizerExpos = async (req, res) => {
  try {
    const expos = await Expo.find({ organizerId: req.user._id })
      .populate("exhibitors", "name email")
      .populate("exhibitorRequests.exhibitorId", "name email");
    res.status(200).json(expos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expos" });
  }
};

/**
 * @desc    Approve or Reject Exhibitor Expo Request
 * @route   PUT /api/expos/request/handle
 * @access  Organizer
 */
export const handleExhibitorRequest = async (req, res) => {
  try {
    const { expoId, exhibitorId, action } = req.body; // action = "approved" or "rejected"
    const organizerId = req.user._id;

    // ✅ Step 1: Validate
    if (!expoId || !exhibitorId || !["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    // ✅ Step 2: Ensure organizer owns this expo
    if (expo.organizerId.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Step 3: Find exhibitor request
    const request = expo.exhibitorRequests.find(
      (r) => r.exhibitorId.toString() === exhibitorId
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    // ✅ Step 4: Update status
    request.status = action;

    // ✅ Step 5: Add exhibitor if approved
    if (action === "approved" && !expo.exhibitors.includes(exhibitorId)) {
      expo.exhibitors.push(exhibitorId);
    }

    await expo.save();

    // ✅ Step 6: Create and send notification
    const notif = await Notification.create({
      userId: exhibitorId,
      message: `Your participation request for Expo "${expo.name}" has been ${action}.`,
      type: "expoResponse",
      meta: { expoId: expo._id, action },
    });

    // ✅ Step 7: Emit realtime event
    sendNotificationRealtime(exhibitorId.toString(), notif);

    res.status(200).json({
      message: `Exhibitor request ${action} successfully.`,
      updatedExpo: expo,
    });
  } catch (error) {
    console.error("Error in handleExhibitorRequest:", error);
    res.status(500).json({ message: "Server error while handling request" });
  }
};