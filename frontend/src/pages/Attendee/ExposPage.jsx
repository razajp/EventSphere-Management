import { useEffect, useState } from "react";
import api from "../../utils/api";
import AttendeeLayout from "../../components/layout/AttendeeLayout";
import ExpoList from "../../components/attendee/ExpoList";

export default function ExposPage() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expos/for-attendee");
      setExpos(res.data);
    } catch (err) {
      console.error("Failed to fetch expos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  return (
    <AttendeeLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Available Expos</h1>
        {loading ? <p>Loading...</p> : <ExpoList expos={expos} refreshExpos={fetchExpos} />}
      </div>
    </AttendeeLayout>
  );
}
