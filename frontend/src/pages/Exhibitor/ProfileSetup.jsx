import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ProfileSetup() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    category: "",
    boothNumber: "",
    contactEmail: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚫 If profile is already completed, redirect to dashboard
  useEffect(() => {
    if (user?.profileCompleted) {
      navigate("/exhibitor", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/exhibitor/profile-setup", form);
      console.log("✅ Profile setup response:", res.data);

      const updatedUser = { ...user, ...res.data.user, profileCompleted: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/exhibitor", { replace: true }); // ✅ redirect to dashboard
    } catch (err) {
      console.error("Profile setup failed:", err);
      setError(err.response?.data?.message || "❌ Failed to setup profile");
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Optional loader during redirect
  if (user?.profileCompleted) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#efede3]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#302f2c] mb-6">
          Complete Your Profile
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input
            label="Company Name"
            name="company"
            placeholder="Enter company name"
            value={form.company}
            onChange={handleChange}
            required
          />
          <Input
            label="Category"
            name="category"
            placeholder="Enter category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <Input
            label="Booth Number"
            name="boothNumber"
            placeholder="Enter booth number"
            value={form.boothNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Contact Email"
            type="email"
            name="contactEmail"
            placeholder="Enter contact email"
            value={form.contactEmail}
            onChange={handleChange}
            required
          />
          <Input
            label="Logo URL"
            name="logoUrl"
            placeholder="https://yourlogo.com/logo.png"
            value={form.logoUrl}
            onChange={handleChange}
          />

          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
