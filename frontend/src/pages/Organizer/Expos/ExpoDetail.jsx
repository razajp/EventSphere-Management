import React from "react";

export default function ExpoDetail({ expo }) {
  if (!expo) return <p>Loading...</p>;

  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {expo.name}</p>
      <p><strong>Location:</strong> {expo.location}</p>
      <p><strong>Start Date:</strong> {expo.startDate}</p>
      <p><strong>End Date:</strong> {expo.endDate}</p>
      <p>
        <strong>Status:</strong>
        <span className={`ml-2 px-2 py-1 rounded-lg text-sm ${
          expo.status === "active" ? "bg-green-200" :
          expo.status === "upcoming" ? "bg-yellow-200" : "bg-gray-200"
        }`}>
          {expo.status}
        </span>
      </p>
      {expo.description && <p><strong>Description:</strong> {expo.description}</p>}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Exhibitors:</h3>
        {expo.exhibitors?.length ? (
          <ul className="list-disc ml-6">
            {expo.exhibitors.map((ex) => (
              <li key={ex._id}>{ex.name} ({ex.profile?.company})</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No exhibitors yet.</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Attendees:</h3>
        {expo.attendees?.length ? (
          <ul className="list-disc ml-6">
            {expo.attendees.map((a) => (
              <li key={a._id}>{a.name} ({a.email})</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No attendees yet.</p>
        )}
      </div>
    </div>
  );
}
