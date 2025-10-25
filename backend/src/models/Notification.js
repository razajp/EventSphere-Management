import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "general",
    },
    meta: {
      type: mongoose.Schema.Types.Mixed, // any extra info like expoId, exhibitorId
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
