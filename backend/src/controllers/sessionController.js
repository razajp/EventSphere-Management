import Expo from "../models/Expo.js";
import Session from "../models/Session.js";

/**
 * @desc Get all sessions for a specific expo
 * @route GET /api/sessions/:expoId
 * @access Organizer / Approved Exhibitor / Joined Attendee
 */
export const getSessionsByExpo = async (req, res) => {
  try {
    const { expoId } = req.params;
    const user = req.user; // from auth middleware

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    // ✅ Access Control
    let authorized = false;

    // Organizer access
    if (user?.role === "organizer" && expo.organizerId.toString() === user._id.toString()) {
      authorized = true;
    }

    // Exhibitor access (approved only)
    if (user?.role === "exhibitor" && expo.exhibitors.some(
      (exhibitor) => exhibitor.toString() === user._id.toString()
    )) {
      authorized = true;
    }

    // Attendee access (joined only)
    if (user?.role === "attendee" && expo.attendees.some(
      (attendee) => attendee.toString() === user._id.toString()
    )) {
      authorized = true;
    }

    // If none authorized
    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to view this expo schedule",
      });
    }

    // ✅ Fetch sessions
    const sessions = await Session.find({ expoId }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};


// Add new session
export const createSession = async (req, res) => {
  try {
    console.log(req.params);
    
    const { title, speaker, timeSlot, location } = req.body;
    const { expoId } = req.params;

    const newSession = await Session.create({
      title,
      speaker,
      timeSlot,
      location,
      expoId,
    });

    res.status(201).json(newSession);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

// Update session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Session.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: "Failed to update session" });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await Session.findByIdAndDelete(id);
    res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Failed to delete session" });
  }
};
