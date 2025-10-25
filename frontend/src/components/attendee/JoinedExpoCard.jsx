import { useState } from "react";
import ViewScheduleModal from "./ViewScheduleModal";
import LeaveButton from "./LeaveButton";

export default function JoinedExpoCard({ expo, refreshExpos }) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div className="border rounded p-4 shadow mb-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{expo.name}</h2>
          <p className="text-sm text-gray-600">Location: {expo.location}</p>
          <p className="text-sm text-gray-500">
            {new Date(expo.startDate).toLocaleDateString()} -{" "}
            {new Date(expo.endDate).toLocaleDateString()}
          </p>
          {expo.description && <p className="mt-2 text-gray-700">{expo.description}</p>}
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setScheduleOpen(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            View Schedule
          </button>

          <LeaveButton expoId={expo._id} refreshExpos={refreshExpos} />
        </div>
      </div>

      <ViewScheduleModal expo={expo} open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
