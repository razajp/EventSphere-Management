import { useState } from "react";
import JoinButton from "./JoinButton";
import ViewScheduleModal from "./ViewScheduleModal";

export default function ExpoCard({ expo, refreshExpos }) {
  const [scheduleModal, setScheduleModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const hasJoined = expo.attendees?.some((a) => a._id === user.id);

  return (
    <div className="border rounded p-4 shadow mb-4 bg-white">
      <h2 className="text-xl font-semibold">{expo.name}</h2>
      <p className="text-sm text-gray-600">Location: {expo.location}</p>
      <p>
        Dates: {new Date(expo.startDate).toLocaleDateString()} -{" "}
        {new Date(expo.endDate).toLocaleDateString()}
      </p>
      {expo.description && <p className="mt-2">{expo.description}</p>}

      {/* Join Button */}
      <JoinButton expo={expo} refreshExpos={refreshExpos} />

      {/* Show schedule only if joined */}
      {hasJoined && (
        <>
          <button
            onClick={() => setScheduleModal(true)}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            View Schedule
          </button>

          <ViewScheduleModal
            expo={expo}
            open={scheduleModal}
            onClose={() => setScheduleModal(false)}
          />
        </>
      )}
    </div>
  );
}
