import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import AttendeeLayout from "../../components/layout/AttendeeLayout";
import Button from "../../components/ui/Button";
import FilterBar from "../../components/attendee/FilterBar";
import SessionCard from "../../components/attendee/SessionCard";
import SessionDetailModal from "../../components/attendee/SessionDetailModal";
import { useSocket } from "../../context/SocketContext"; // ✅ use hook

export default function Schedules() {
  const socket = useSocket();
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    expo: "",
    date: "",
    speaker: "",
    favoritesOnly: false,
  });
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all sessions and favorites
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendee/schedules");
      const favRes = await api.get("/auth/me");
      setSessions(res.data || []);
      setFavorites(favRes.data?.favorites || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ✅ Real-time updates
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => fetchSchedules();

    socket.on("session:update", handleUpdate);
    socket.on("session:new", handleUpdate);
    socket.on("session:delete", handleUpdate);

    return () => {
      socket.off("session:update", handleUpdate);
      socket.off("session:new", handleUpdate);
      socket.off("session:delete", handleUpdate);
    };
  }, [socket]);

  // ✅ Apply filters
  useEffect(() => {
    let data = [...sessions];
    if (filters.expo) data = data.filter((s) => s.expo?.name === filters.expo);
    if (filters.date) data = data.filter((s) => s.date === filters.date);
    if (filters.speaker) data = data.filter((s) => s.speaker === filters.speaker);
    if (filters.favoritesOnly)
      data = data.filter((s) => favorites.includes(s._id));
    setFiltered(data);
  }, [filters, sessions, favorites]);

  // ✅ Handle favorite toggle update from modal
  const handleFavoriteUpdate = (sessionId, isFav) => {
    setFavorites((prev) =>
      isFav ? [...prev, sessionId] : prev.filter((id) => id !== sessionId)
    );
  };

  return (
    <AttendeeLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <Button onClick={fetchSchedules}>↻ Refresh</Button>
        </div>

        <FilterBar
          sessions={sessions}
          filters={filters}
          setFilters={setFilters}
          showFavToggle
        />

        {loading ? (
          <p className="text-center text-gray-600">Loading schedule...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No sessions match your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onClick={setSelected}
                favoriteIds={favorites}
              />
            ))}
          </div>
        )}

        <SessionDetailModal
          session={selected}
          onClose={() => setSelected(null)}
          favoriteIds={favorites}
          onFavoriteUpdate={handleFavoriteUpdate}
        />
      </div>
    </AttendeeLayout>
  );
}
