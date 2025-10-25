import ExhibitorLayout from "../../components/layout/ExhibitorLayout";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function ExhibitorDashboard() {
  const [stats, setStats] = useState({
    expos: 0,
    exhibitors: 0,
    attendees: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/exhibitor/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <ExhibitorLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold">{stats.expos}</h2>
          <p className="text-sm mt-2 text-gray-600">Total Expos</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold">{stats.exhibitors}</h2>
          <p className="text-sm mt-2 text-gray-600">Total Exhibitors</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold">{stats.attendees}</h2>
          <p className="text-sm mt-2 text-gray-600">Total Attendees</p>
        </div>
      </div>
    </ExhibitorLayout>
  );
}
