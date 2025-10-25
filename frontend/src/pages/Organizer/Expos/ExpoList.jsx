import { useEffect, useState } from "react";
import api from "../../../utils/api";
import OrganizerLayout from "../../../components/layout/OrganizerLayout";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import ExpoForm from "./ExpoForm";
import ExpoDetail from "./ExpoDetail";
import ScheduleModal from "../schedule/ScheduleModal";

export default function ExpoList() {
  const [expos, setExpos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState(null);

  // Fetch all expos
  const fetchExpos = async () => {
    try {
      const res = await api.get("/expos");
      const currentDate = new Date();

      const updated = res.data.map((expo) => {
        const start = new Date(expo.startDate);
        const end = new Date(expo.endDate);
        let status = "upcoming";
        if (currentDate >= start && currentDate <= end) status = "active";
        else if (currentDate > end) status = "completed";
        return { ...expo, status };
      });

      setExpos(updated);
    } catch (error) {
      console.error("Failed to fetch expos:", error);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  // Delete an expo
  const handleDelete = async (expo) => {
    if (expo.status === "completed") {
      alert("You cannot delete a completed expo.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this expo?")) return;

    try {
      await api.delete(`/expos/${expo._id}`);
      fetchExpos();
    } catch (error) {
      console.error("Failed to delete expo:", error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    {
      key: "startDate",
      label: "Start",
      render: (expo) => new Date(expo.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End",
      render: (expo) => new Date(expo.endDate).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (expo) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            expo.status === "completed"
              ? "bg-gray-200 text-gray-700"
              : expo.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {expo.status.charAt(0).toUpperCase() + expo.status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <OrganizerLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Expos</h1>
        <Button
          onClick={() => {
            setSelectedExpo(null);
            setModalOpen(true);
          }}
        >
          + Add Expo
        </Button>
      </div>

      <Table
        columns={columns}
        data={expos}
        actions={(expo) => (
          <div className="flex gap-2">
            {/* View button always visible */}
            <Button
              variant="light"
              onClick={() => {
                setSelectedExpo(expo);
                setDetailModal(true);
              }}
            >
              View
            </Button>

            {/* Schedule button */}
            <Button
              variant="light"
              onClick={() => {
                setSelectedExpo(expo);
                setScheduleModal(true);
              }}
            >
              Schedule
            </Button>

            {/* Edit only if not completed */}
            <Button
              variant="light"
              disabled={expo.status === "completed"}
              title={
                expo.status === "completed"
                  ? "Cannot edit a completed expo"
                  : "Edit expo"
              }
              onClick={() => {
                if (expo.status === "completed") return;
                setSelectedExpo(expo);
                setModalOpen(true);
              }}
            >
              Edit
            </Button>

            {/* Delete only if not completed */}
            <Button
              variant="light"
              disabled={expo.status === "completed"}
              title={
                expo.status === "completed"
                  ? "Cannot delete a completed expo"
                  : "Delete expo"
              }
              onClick={() => handleDelete(expo)}
            >
              Delete
            </Button>
          </div>
        )}
      />

      {/* Expo Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedExpo ? "Edit Expo" : "Add Expo"}
      >
        <ExpoForm
          expo={selectedExpo}
          onSuccess={() => {
            fetchExpos();
            setModalOpen(false);
          }}
        />
      </Modal>

      {/* Expo Detail Modal */}
      <Modal
        open={detailModal}
        onClose={() => setDetailModal(false)}
        title="Expo Details"
      >
        <ExpoDetail expo={selectedExpo} />
      </Modal>

      {/* Schedule Management Modal */}
      <ScheduleModal
        expo={selectedExpo}
        open={scheduleModal}
        onClose={() => setScheduleModal(false)}
      />
    </OrganizerLayout>
  );
}
