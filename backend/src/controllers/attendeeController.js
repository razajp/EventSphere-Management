import Expo from "../models/Expo.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

export const getAttendeeStats = async (req, res) => {
  try {
    const attendeeId = req.user._id;

    // Find all expos joined by attendee
    const joinedExpos = await Expo.find({ attendees: attendeeId });

    const joinedExpoIds = joinedExpos.map((e) => e._id);

    // Count all sessions in joined expos
    const totalSessions = await Session.countDocuments({
      expoId: { $in: joinedExpoIds },
    });

    // Count upcoming sessions
    const now = new Date();
    const upcomingSessions = await Session.countDocuments({
      expoId: { $in: joinedExpoIds },
      startTime: { $gte: now },
    });

    res.status(200).json({
      joinedExpos: joinedExpos.length,
      totalSessions,
      upcomingSessions,
    });
  } catch (error) {
    console.error("Error fetching attendee stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/attendee/my-schedule
// @access  Attendee
export const getSchedules = async (req, res) => {
  try {
    const attendeeId = req.user._id;

    // Find expos this attendee has joined
    const expos = await Expo.find({ attendees: attendeeId }).select("_id name");

    if (!expos.length)
      return res.status(200).json([]); // no joined expos yet

    // Get all sessions for these expos
    const sessions = await Session.find({
      expoId: { $in: expos.map((e) => e._id) },
    })
      .populate("expoId", "name location startDate endDate")
      .sort({ createdAt: -1 });

    // Format sessions with expo name for frontend
    const formatted = sessions.map((s) => ({
      ...s._doc,
      expo: s.expoId,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching attendee schedule:", err);
    res.status(500).json({ message: "Failed to fetch attendee schedule" });
  }
};

/**
 * @desc Toggle favorite session
 * @route POST /api/attendee/favorites/:sessionId
 * @access Attendee
 */
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in attendee
    const { sessionId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "attendee") {
      return res.status(403).json({ message: "Only attendees can favorite sessions" });
    }

    const alreadyFav = user.favorites.includes(sessionId);

    if (alreadyFav) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== sessionId
      );
      await user.save();
      return res.json({ message: "Removed from favorites", favorite: false });
    } else {
      user.favorites.push(sessionId);
      await user.save();
      return res.json({ message: "Added to favorites", favorite: true });
    }
  } catch (error) {
    console.error("Favorite toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};