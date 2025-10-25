import { useState, useEffect } from "react";

export default function FilterBar({ sessions, filters, setFilters, showFavToggle }) {
  const [expoOptions, setExpoOptions] = useState([]);
  const [speakerOptions, setSpeakerOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    const expos = [...new Set(sessions.map((s) => s.expo?.name || "Unknown Expo"))];
    const speakers = [...new Set(sessions.map((s) => s.speaker || "Unknown Speaker"))];
    const dates = [...new Set(sessions.map((s) => s.date || "No Date"))];
    setExpoOptions(expos);
    setSpeakerOptions(speakers);
    setDateOptions(dates);
  }, [sessions]);

  const handleChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">
      <select className="border rounded-lg px-3 py-2" value={filters.expo || ""} onChange={(e) => handleChange("expo", e.target.value)}>
        <option value="">All Expos</option>
        {expoOptions.map((expo, idx) => (
          <option key={`expo-${idx}`} value={expo}>{expo}</option>
        ))}
      </select>

      <select className="border rounded-lg px-3 py-2" value={filters.date || ""} onChange={(e) => handleChange("date", e.target.value)}>
        <option value="">All Dates</option>
        {dateOptions.map((date, idx) => (
          <option key={`date-${idx}`} value={date}>{date}</option>
        ))}
      </select>

      <select className="border rounded-lg px-3 py-2" value={filters.speaker || ""} onChange={(e) => handleChange("speaker", e.target.value)}>
        <option value="">All Speakers</option>
        {speakerOptions.map((speaker, idx) => (
          <option key={`speaker-${idx}`} value={speaker}>{speaker}</option>
        ))}
      </select>

      {showFavToggle && (
        <label className="flex items-center gap-2 ml-auto text-sm">
          <input
            type="checkbox"
            checked={filters.favoritesOnly || false}
            onChange={(e) => handleChange("favoritesOnly", e.target.checked)}
          />
          Show Favorites Only
        </label>
      )}
    </div>
  );
}
