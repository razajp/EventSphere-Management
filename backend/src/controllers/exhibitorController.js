import User from "../models/User.js";
import Expo from "../models/Expo.js";

export const getExhibitorStats = async (req, res) => {
  try {
    // logged-in exhibitor
    const exhibitorId = req.user._id;

    // Example stats (aap apne logic ke hisaab se modify kar sakte ho)
    const totalExpos = await Expo.countDocuments({ exhibitors: exhibitorId });
    const upcomingExpos = await Expo.countDocuments({
      exhibitors: exhibitorId,
      startDate: { $gte: new Date() },
    });
    const pastExpos = await Expo.countDocuments({
      exhibitors: exhibitorId,
      endDate: { $lt: new Date() },
    });

    res.json({
      totalExpos,
      upcomingExpos,
      pastExpos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exhibitor stats" });
  }
};

// Exhibitor Profile Setup
export const completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { company, category, boothNumber, contactEmail, logoUrl } = req.body;

    // Validation
    if (!company || !category || !boothNumber || !contactEmail) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "exhibitor") {
      return res
        .status(403)
        .json({ message: "Only exhibitors can complete profile" });
    }

    // ✅ Save inside "profile"
    user.profile = {
      company,
      category,
      boothNumber,
      contactEmail,
      logoUrl: logoUrl || "",
    };

    user.status = "active";
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      message: "Profile setup completed successfully",
      user,
    });
  } catch (err) {
    console.error("Profile setup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};