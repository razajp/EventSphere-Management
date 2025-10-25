import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ExpoExhibitorList from "../../../components/organizer/ExpoExhibitorList";
import OrganizerLayout from "../../../components/layout/OrganizerLayout";

export default function ExhibitorList() {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/organizer/expos");
      setExpos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  return (
    <OrganizerLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Exhibitors</h1>
        {loading ? <p>Loading...</p> : <ExpoExhibitorList expos={expos} refresh={fetchExpos} />}
      </div>
    </OrganizerLayout>
  );
}
