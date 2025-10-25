import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Button from "../../../components/ui/Button";

export default function ScheduleModal({ expo, open, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    speaker: "",
    timeSlot: "",
    location: "",
  });
  const [editing, setEditing] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/sessions/${expo._id}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  useEffect(() => {
    if (open && expo?._id) fetchSessions();
  }, [open, expo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/sessions/${editing._id}`, form);
      } else {
        await api.post(`/sessions/${expo._id}`, form);
      }
      setForm({ title: "", speaker: "", timeSlot: "", location: "" });
      setEditing(null);
      fetchSessions();
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions();
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Manage Schedule — {expo.name}
          </h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded w-full px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="Speaker"
            value={form.speaker}
            onChange={(e) => setForm({ ...form, speaker: e.target.value })}
            className="border rounded w-full px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="Time Slot (e.g. 10:00 AM - 11:00 AM)"
            value={form.timeSlot}
            onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            className="border rounded w-full px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="Location/Hall"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border rounded w-full px-2 py-1"
            required
          />

          <Button type="submit">
            {editing ? "Update Session" : "Add Session"}
          </Button>
        </form>

        <div className="max-h-60 overflow-y-auto">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-gray-600">
                  {s.speaker} — {s.timeSlot} — {s.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="light"
                  onClick={() => {
                    setEditing(s);
                    setForm(s);
                  }}
                >
                  Edit
                </Button>
                <Button variant="light" onClick={() => handleDelete(s._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-gray-500">No sessions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
