import { useState } from "react";
import api from "../../utils/api";
import Button from "../ui/Button";

export default function LeaveButton({ expoId, refreshExpos }) {
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this expo?")) return;

    setLoading(true);
    try {
      await api.post(`/attendee/leave/${expoId}`);
      // refresh the list
      refreshExpos();
    } catch (err) {
      console.error("Failed to leave expo", err);
      alert(err.response?.data?.message || "Failed to leave expo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleLeave} disabled={loading} variant="light">
      {loading ? "Leaving..." : "Leave Expo"}
    </Button>
  );
}
