import { useEffect, useState } from "react";
import api from "../../utils/api";
import ExhibitorLayout from "../../components/layout/ExhibitorLayout";
import ExpoList from "../../components/exhibitor/ExpoList";

export default function ExposPage() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyExpos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expos/for-exhibitor");
      setExpos(res.data);
    } catch (err) {
      console.error("Failed to fetch expos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyExpos();
  }, []);

  return (
    <ExhibitorLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Expos</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ExpoList expos={expos} refreshExpos={fetchMyExpos} />
        )}
      </div>
    </ExhibitorLayout>
  );
}
