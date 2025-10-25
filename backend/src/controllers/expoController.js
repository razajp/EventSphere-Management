import Expo from "../models/Expo.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendNotificationRealtime } from "../server.js";

/**
 * @desc    Create new Expo
 * @route   POST /api/expos
 * @access  Organizer (protected)
 */
export const createExpo = async (req, res) => {
  try {
    const { name, location, startDate, endDate, description, boothStart, boothEnd } = req.body;
    const organizerId = req.user?._id;

    // 🔒 Validation
    if (!organizerId)
      return res.status(401).json({ message: "Unauthorized: No organizer found" });

    if (!name || !location || !startDate || !endDate || !boothStart || !boothEnd)
      return res.status(400).json({ message: "Please fill all required fields" });

    // 🧱 Create new Expo
    const newExpo = new Expo({
      name,
      location,
      startDate,
      endDate,
      description,
      organizerId,
      boothStart,
      boothEnd,
    });

    const savedExpo = await newExpo.save();

    // 👥 Get all exhibitors
    const exhibitors = await User.find({ role: "exhibitor" }).select("_id");

    // 🔔 Create notification objects
    const notifications = exhibitors.map((ex) => ({
      userId: ex._id,
      message: `A new Expo "${savedExpo.name}" has been created!`,
      type: "newExpo",
      meta: { expoId: savedExpo._id },
    }));

    // 📦 Save all notifications at once
    const savedNotifs = await Notification.insertMany(notifications);

    // ⚡ Emit realtime notifications to each exhibitor
    savedNotifs.forEach((notif) => {
      sendNotificationRealtime(notif.userId.toString(), notif);
    });

    // ✅ Response
    res.status(201).json({
      message: "Expo created successfully and exhibitors notified",
      expo: savedExpo,
    });
  } catch (error) {
    console.error("Error creating expo:", error);
    res.status(500).json({ message: "Server error while creating expo" });
  }
};

/**
 * @desc    Get expos (public or organizer-specific)
 * @route   GET /api/expos
 * @access  Public
 */
export const getExpos = async (req, res) => {
  try {
    const { organizer } = req.query;
    const filter = organizer ? { organizerId: organizer } : {};

    const expos = await Expo.find(filter)
      .populate("organizerId", "name email role")
      .populate("exhibitors", "name email profile.company")
      .populate("attendees", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expos);
  } catch (error) {
    console.error("Error fetching expos:", error);
    res.status(500).json({ message: "Server error while fetching expos" });
  }
};

/**
 * @desc    Update an existing Expo (only organizer who owns it)
 * @route   PUT /api/expos/:id
 * @access  Organizer
 */
export const updateExpo = async (req, res) => {
  try {
    const expoId = req.params.id;
    const organizerId = req.user?._id;

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    if (expo.organizerId.toString() !== organizerId.toString())
      return res.status(403).json({ message: "You are not authorized to edit this expo" });

    const { name, location, startDate, endDate, description, boothStart, boothEnd } = req.body;

    expo.name = name || expo.name;
    expo.location = location || expo.location;
    expo.startDate = startDate || expo.startDate;
    expo.endDate = endDate || expo.endDate;
    expo.description = description || expo.description;
    expo.boothStart = boothStart || expo.boothStart;
    expo.boothEnd = boothEnd || expo.boothEnd;

    await expo.save();

    // ✅ Find exhibitors with approved or pending status
    const validExhibitors = expo.exhibitorRequests
      .filter((req) => req.status === "approved" || req.status === "pending")
      .map((req) => req.exhibitorId);

    if (validExhibitors.length > 0) {
      const notifications = validExhibitors.map((exId) => ({
        userId: exId,
        message: `Expo "${expo.name}" details have been updated.`,
        type: "expoUpdate",
        meta: { expoId: expo._id },
      }));

      const savedNotifs = await Notification.insertMany(notifications);

      // ⚡ Send realtime notifications
      savedNotifs.forEach((notif) =>
        sendNotificationRealtime(notif.userId.toString(), notif)
      );
    }

    res.status(200).json({ message: "Expo updated successfully", expo });
  } catch (error) {
    console.error("Error updating expo:", error);
    res.status(500).json({ message: "Server error while updating expo" });
  }
};

/**
 * @desc Request to participate in an expo
 * @route POST /api/expos/request/:id
 * @access Exhibitor
 */
export const requestParticipation = async (req, res) => {
  try {
    const expoId = req.params.id;
    const exhibitorId = req.user._id;
    const { selectedBooth } = req.body;

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    // Check if booth is within range
    if (selectedBooth < expo.boothStart || selectedBooth > expo.boothEnd)
      return res.status(400).json({ message: "Invalid booth number" });

    // Check if booth is already taken
    const assignedBooths = expo.exhibitors.map(e => e.boothNumber);
    if (assignedBooths.includes(selectedBooth))
      return res.status(400).json({ message: "Booth already taken" });

    // Check if already requested
    if (expo.exhibitorRequests.some(r => r.exhibitorId.toString() === exhibitorId.toString()))
      return res.status(400).json({ message: "You already requested" });

    // Add request
    expo.exhibitorRequests.push({ exhibitorId, boothNumber: selectedBooth });
    await expo.save();

    // Notify organizer
    const notif = await Notification.create({
      userId: expo.organizerId,
      message: `${req.user.name} requested booth ${selectedBooth} for "${expo.name}"`,
      type: "expoRequest",
      meta: { expoId, exhibitorId, boothNumber: selectedBooth },
    });

    // Emit realtime notification
    sendNotificationRealtime(expo.organizerId.toString(), notif);

    res.status(200).json({ message: "Participation request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete an Expo (only organizer who owns it)
 * @route   DELETE /api/expos/:id
 * @access  Organizer
 */
export const deleteExpo = async (req, res) => {
  try {
    const expoId = req.params.id;
    const organizerId = req.user._id;

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    if (expo.organizerId.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this expo" });
    }

    // ✅ Filter exhibitors (pending or approved only)
    const validExhibitors = expo.exhibitorRequests
      .filter((req) => req.status === "approved" || req.status === "pending")
      .map((req) => req.exhibitorId);

    if (validExhibitors.length > 0) {
      const notifications = validExhibitors.map((exId) => ({
        userId: exId,
        message: `Expo "${expo.name}" has been deleted by the organizer.`,
        type: "expoDelete",
        meta: { expoId: expo._id },
      }));

      const savedNotifs = await Notification.insertMany(notifications);

      // ⚡ Emit realtime notifications
      savedNotifs.forEach((notif) =>
        sendNotificationRealtime(notif.userId.toString(), notif)
      );
    }

    await Expo.findByIdAndDelete(expoId);

    res.status(200).json({ message: `Expo "${expo.name}" deleted successfully` });
  } catch (error) {
    console.error("Error deleting expo:", error);
    res.status(500).json({ message: "Server error while deleting expo" });
  }
};

/**
 * @desc    Get expos (public or organizer-specific) excluding completed expos
 * @route   GET /api/expos
 * @access  Public
 */
export const getExposForExhibitor = async (req, res) => {
  try {
    const { organizer } = req.query;
    const now = new Date();

    // base filter
    const filter = {
      ...(organizer ? { organizerId: organizer } : {}),
      endDate: { $gte: now }, // exclude expos that have already ended
    };

    const expos = await Expo.find(filter)
      .populate("organizerId", "name email role")
      .populate("exhibitors", "name email profile.company")
      .populate("attendees", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expos);
  } catch (error) {
    console.error("Error fetching expos:", error);
    res.status(500).json({ message: "Server error while fetching expos" });
  }
};

/**
 * @desc    Get all active or upcoming expos (exclude completed ones)
 * @route   GET /api/expos/for-attendee
 * @access  Public / Attendee
 */
export const getExposForAttendee = async (req, res) => {
  try {
    const { organizer } = req.query;
    const now = new Date();

    // 🔹 Base filter: only expos whose endDate is in the future (active or upcoming)
    const filter = {
      ...(organizer ? { organizerId: organizer } : {}),
      endDate: { $gte: now },
    };

    const expos = await Expo.find(filter)
      .populate("organizerId", "name email role")
      .populate("exhibitors", "name email profile.company")
      .populate("attendees", "name email")
      .sort({ startDate: 1 }); // soonest expos first

    res.status(200).json(expos);
  } catch (error) {
    console.error("Error fetching expos for attendee:", error);
    res.status(500).json({
      message: "Server error while fetching expos for attendee",
    });
  }
};

/**
 * @desc   Attendee join an expo
 * @route  POST /api/expos/join/:id
 * @access Attendee
 */
export const joinExpo = async (req, res) => {
  try {
    const expoId = req.params.id;
    const attendeeId = req.user._id;

    const expo = await Expo.findById(expoId);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    // already joined check
    if (expo.attendees.includes(attendeeId)) {
      return res.status(400).json({ message: "You already joined this expo" });
    }

    expo.attendees.push(attendeeId);
    await expo.save();

    res.status(200).json({ message: "Expo joined successfully" });
  } catch (error) {
    console.error("Error joining expo:", error);
    res.status(500).json({ message: "Server error while joining expo" });
  }
};

// Leave Expo
export const leaveExpo = async (req, res) => {
  try {
    const { id } = req.params; // expo ID
    const userId = req.user._id;

    const expo = await Expo.findById(id);
    if (!expo) return res.status(404).json({ message: "Expo not found" });

    expo.attendees = expo.attendees.filter(
      (attendeeId) => attendeeId.toString() !== userId.toString()
    );

    await expo.save();

    res.status(200).json({ message: "You left the expo successfully" });
  } catch (err) {
    console.error("Leave Expo Error:", err);
    res.status(500).json({ message: "Failed to leave expo" });
  }
};