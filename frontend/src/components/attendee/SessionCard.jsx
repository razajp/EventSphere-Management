import { useEffect, useState } from "react";

export default function SessionCard({ session, onClick, favoriteIds }) {
  const [status, setStatus] = useState("");

  const updateStatus = () => {
    const now = new Date();
    const start = new Date(session.startTime || session.date);
    const end = new Date(session.endTime || start.getTime() + 60 * 60 * 1000);

    if (now >= start && now <= end) setStatus("Live Now");
    else if (start - now <= 30 * 60 * 1000 && start > now) setStatus("Starting Soon");
    else setStatus("");
  };

  useEffect(() => {
    updateStatus(); // initial
    const interval = setInterval(updateStatus, 60 * 1000); // every minute
    return () => clearInterval(interval);
  }, [session]);

  const isFavorite = favoriteIds?.includes(session._id);

  return (
    <div
      onClick={() => onClick(session)}
      className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition cursor-pointer relative"
    >
      {status && (
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
            status === "Live Now"
              ? "bg-green-500 text-white"
              : "bg-orange-400 text-white"
          }`}
        >
          {status}
        </span>
      )}

      <h3 className="font-semibold text-lg flex items-center gap-2">
        {session.title}
        {isFavorite && <span className="text-yellow-400">⭐</span>}
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Speaker:</strong> {session.speaker}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Time:</strong> {session.timeSlot}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Location:</strong> {session.location}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Expo: {session.expo?.name || "Unknown"}
      </p>
    </div>
  );
}
