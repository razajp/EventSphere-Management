import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

// ---------------- SIGNUP ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if(await User.findOne({ email })) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({ name, email, password: hashed, role, verificationToken: token });
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({ to: email, subject: "Verify Email", text: `Click to verify: ${verifyLink}` });

    res.status(201).json({ message: "Registered! Check email to verify." });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if(!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: "Email verified successfully" });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "User not found" });
    if(!user.isVerified) return res.status(403).json({ message: "Email not verified" });

    if(!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({ to: email, subject: "Reset Password", text: `Reset link: ${resetLink}` });

    res.json({ message: "Password reset email sent" });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if(!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

// ---------------- RESEND VERIFICATION EMAIL ----------------
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({ to: email, subject: "Verify Email", text: `Click to verify: ${verifyLink}` });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ME ----------------
export const getMe = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if(!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites || [],
    });
  } catch(err){ res.status(500).json({ message: "Server error" }); }
};
