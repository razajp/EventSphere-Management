import { useState } from "react";
import Input from "../../components/ui/Input";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      addToast("Password reset link sent! Check your email.", "success");
      navigate("/login");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to send reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#efede3]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#302f2c]">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#302f2c] text-[#efede3] rounded-xl font-medium hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
