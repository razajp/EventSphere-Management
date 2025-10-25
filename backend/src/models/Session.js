import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    timeSlot: { type: String, required: true }, // e.g. "10:00 AM – 11:00 AM"
    location: { type: String, required: true },
    expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
