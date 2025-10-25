import React, { useState } from "react";
import api from "../../utils/api";
import Button from "../ui/Button";

export default function RequestActions({ expoId, exhibitorId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await api.post("/organizer/exhibitor-request", { expoId, exhibitorId, action });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleAction("approved")} disabled={loading}>Approve</Button>
      <Button onClick={() => handleAction("rejected")} disabled={loading} variant="danger">Reject</Button>
    </div>
  );
}
