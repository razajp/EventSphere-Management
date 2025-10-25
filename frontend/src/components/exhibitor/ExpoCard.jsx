import { useState } from "react";
import RequestButton from "./RequestButton";
import ViewScheduleModal from "./ViewScheduleModal";

export default function ExpoCard({ expo, refreshExpos }) {
  const [scheduleModal, setScheduleModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // find request and approval status
  const requestObj = expo.exhibitorRequests?.find(
    (r) => r.exhibitorId === user.id
  );
  const approvedObj = expo.exhibitors?.find((e) => e._id === user.id);
  const isApproved = !!approvedObj;

  return (
    <div className="border rounded p-4 shadow mb-4 bg-white">
      <h2 className="text-xl font-semibold">{expo.name}</h2>
      <p className="text-sm text-gray-600">Location: {expo.location}</p>
      <p>
        Dates: {new Date(expo.startDate).toLocaleDateString()} -{" "}
        {new Date(expo.endDate).toLocaleDateString()}
      </p>
      {expo.description && <p className="mt-2">{expo.description}</p>}

      {/* Exhibitor booth request system */}
      <RequestButton expo={expo} refreshExpos={refreshExpos} />

      {/* Show schedule button only if approved */}
      {isApproved && (
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
