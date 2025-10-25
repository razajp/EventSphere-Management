import AttendeeLayout from "../../components/layout/AttendeeLayout";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AttendeeDashboard() {
  const [stats, setStats] = useState({
    joinedExpos: 0,
    totalSessions: 0,
    upcomingSessions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/attendee/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch attendee stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AttendeeLayout>
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold text-[#302f2c]">
            {stats.joinedExpos}
          </h2>
          <p className="text-sm mt-2 text-gray-600">Joined Expos</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold text-[#302f2c]">
            {stats.totalSessions}
          </h2>
          <p className="text-sm mt-2 text-gray-600">Total Sessions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold text-[#302f2c]">
            {stats.upcomingSessions}
          </h2>
          <p className="text-sm mt-2 text-gray-600">Upcoming Sessions</p>
        </div>
      </div>
    </AttendeeLayout>
  );
}
