import React from "react";
import RequestActions from "./RequestActions";

export default function ExhibitorCard({ exhibitor, request, onActionSuccess }) {
  return (
    <div className="border p-3 rounded mb-3 flex justify-between items-center">
      <div>
        <p className="font-medium">{exhibitor.name}</p>
        <p className="text-sm text-gray-500">{exhibitor.email}</p>
        <p className="text-sm">
          Request status: <span className="font-semibold">{request.status}</span>
        </p>
      </div>
      {request.status === "pending" && (
        <RequestActions
          expoId={request.expoId}
          exhibitorId={exhibitor._id}
          onSuccess={onActionSuccess}
        />
      )}
    </div>
  );
}
