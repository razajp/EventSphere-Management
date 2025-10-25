import { useState } from "react";
import api from "../../utils/api";
import Button from "../ui/Button";

export default function JoinButton({ expo, refreshExpos }) {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const hasJoined = expo.attendees?.some((a) => a._id === user.id);

  // 🔹 Join Expo
  const handleJoin = async () => {
    if (!window.confirm(`Join "${expo.name}" expo?`)) return;
    setLoading(true);
    try {
      await api.post(`/expos/join/${expo._id}`);
      refreshExpos();
    } catch (err) {
      console.error("Failed to join expo:", err);
      alert(err.response?.data?.message || "Failed to join expo");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Leave Expo
  const handleLeave = async () => {
    if (!window.confirm(`Leave "${expo.name}" expo?`)) return;
    setLoading(true);
    try {
      await api.post(`/expos/leave/${expo._id}`);
      refreshExpos();
    } catch (err) {
      console.error("Failed to leave expo:", err);
      alert(err.response?.data?.message || "Failed to leave expo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      {hasJoined ? (
        <Button
          onClick={handleLeave}
          disabled={loading}
          variant="light"
          className="bg-red-100 text-red-700 hover:bg-red-200"
        >
          {loading ? "Leaving..." : "Leave Expo"}
        </Button>
      ) : (
        <Button
          onClick={handleJoin}
          disabled={loading}
          variant="light"
          className="bg-green-100 text-green-700 hover:bg-green-200"
        >
          {loading ? "Joining..." : "Join Expo"}
        </Button>
      )}
    </div>
  );
}
