import api from "../../utils/api";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SessionDetailModal({
  session,
  onClose,
  favoriteIds = [],
  onFavoriteUpdate,
}) {
  // ✅ Hooks at the top level
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Initialize favorite whenever session or favoriteIds change
  useEffect(() => {
    if (session) {
      setFavorite(favoriteIds.includes(session._id));
    }
  }, [session, favoriteIds]);

  // ✅ If no session, render nothing
  if (!session) return null;

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/attendee/favorites/${session._id}`);
      setFavorite(res.data.favorite);
      onFavoriteUpdate(session._id, res.data.favorite);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2">{session.title}</h2>
        <p className="text-gray-600 mb-3">
          <strong>Speaker:</strong> {session.speaker}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Time:</strong> {session.timeSlot}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Location:</strong> {session.location}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Date:</strong> {session.date}
        </p>

        <p className="mt-3 text-sm text-gray-700">{session.description}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded-lg transition ${
              favorite
                ? "bg-yellow-500 text-black"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            ⭐ {favorite ? "Favorited" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
