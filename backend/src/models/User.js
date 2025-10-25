import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  company: String,
  category: String,
  boothNumber: String,
  contactEmail: String,
  logoUrl: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer","exhibitor","attendee"], default: "attendee" },

  isVerified: { type: Boolean, default: false },
  verificationToken: String,

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  status: { type: String, enum: ["pending","active","inactive"], default: "active" },
  profileCompleted: { type: Boolean, default: false },
  profile: profileSchema,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
}, { timestamps: true });

userSchema.pre("save", function(next) {
  if(this.isNew && this.role === "exhibitor") {
    this.status = "pending";
    this.profileCompleted = false;
  }
  next();
});

export default mongoose.model("User", userSchema);
