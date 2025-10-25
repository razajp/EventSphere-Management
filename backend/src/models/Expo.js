import mongoose from "mongoose";

const exhibitorRequestSchema = new mongoose.Schema(
  {
    exhibitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    boothNumber: {type: Number},
  },
  { _id: false }
);

const expoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, trim: true },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Related users
    exhibitors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    exhibitorRequests: [exhibitorRequestSchema],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Expo lifecycle
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },

    boothStart: { type: Number, default: 1 }, // starting booth number
    boothEnd: { type: Number, default: 20 },  // ending booth number
  },
  { timestamps: true }
);

// ✅ Auto update status before saving
expoSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (currentDate < this.startDate) this.status = "upcoming";
  else if (currentDate >= this.startDate && currentDate <= this.endDate)
    this.status = "active";
  else if (currentDate > this.endDate) this.status = "completed";
  next();
});

export default mongoose.model("Expo", expoSchema);
