import { useEffect, useState } from "react";
import api from "../../utils/api";
import Button from "../ui/Button";

export default function ViewScheduleModal({ expo, open, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sessions for this expo
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/sessions/${expo._id}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && expo?._id) fetchSessions();
  }, [open, expo]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedule — {expo.name}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading schedule...</p>
        ) : sessions.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="border rounded-lg p-3 bg-gray-50 shadow-sm"
              >
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-gray-600">
                  Speaker: {s.speaker}
                </p>
                <p className="text-sm text-gray-500">
                  {s.timeSlot} — {s.location}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No sessions added yet</p>
        )}

        <div className="mt-4 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
