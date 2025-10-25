import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import api from "../../utils/api";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/resend-verification", { email });
      addToast("Verification email sent!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Error sending email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 bg-[#302f2c] text-white p-2 rounded"
      >
        {loading ? "Sending..." : "Resend Verification"}
      </button>
    </form>
  );
}
