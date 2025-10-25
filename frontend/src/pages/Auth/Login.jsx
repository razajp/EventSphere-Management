import { useState } from "react";
import Input from "../../components/ui/Input";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResend(false);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      login({ token, user });
      addToast("Login successful!", "success");

      if (user.role === "organizer") navigate("/organizer");
      else if (user.role === "exhibitor") navigate("/exhibitor");
      else navigate("/attendee");

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      addToast(msg, "error");

      if (msg === "Email not verified") {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await api.post("/auth/resend-verification", { email: form.email });
      addToast("Verification email sent again!", "success");
      setShowResend(false);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to resend email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#efede3]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#302f2c]">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {/* Forgot Password Link */}
          <div className="text-right mt-1 mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#302f2c] text-[#efede3] rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-[#efede3]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {showResend && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-500 mb-2">Email not verified.</p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#302f2c] font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
