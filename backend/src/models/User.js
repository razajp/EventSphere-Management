import mongoose from "mongoose";

// ✅ Define embedded profile schema
const profileSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    category: { type: String, trim: true },
    boothNumber: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
  },
  { _id: false } // no separate _id for subdocument
);

// ✅ Main user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["organizer", "exhibitor", "attendee"],
      default: "attendee",
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "active", // will be overridden in pre-save
    },
    profileCompleted: { type: Boolean, default: false },
    profile: profileSchema, // 👈 nested exhibitor details
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }], // ⭐ added
  },
  { timestamps: true }
);

// ✅ Automatically set exhibitor defaults on first save
userSchema.pre("save", function (next) {
  if (this.isNew && this.role === "exhibitor") {
    this.status = "pending";
    this.profileCompleted = false;
  }
  next();
});

export default mongoose.model("User", userSchema);
