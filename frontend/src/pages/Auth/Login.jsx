import { useState } from "react";
import Input from "../../components/ui/Input";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 👈 use global context

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 from AuthContext
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      // store locally
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // update context
      login({ token, user });

      // redirect based on role
      if (user.role === "organizer") navigate("/organizer");
      else if (user.role === "exhibitor") navigate("/exhibitor");
      else navigate("/attendee");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

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
