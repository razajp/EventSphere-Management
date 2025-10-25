import Notification from "../models/Notification.js";

/**
 * @desc Get all notifications for logged-in user
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * @desc Mark a notification as read
 * @route PUT /api/notifications/:id/read
 * @access Private
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};
