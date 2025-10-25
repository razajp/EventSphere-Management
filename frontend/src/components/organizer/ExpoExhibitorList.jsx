import React from "react";
import ExhibitorCard from "./ExhibitorCard";

export default function ExpoExhibitorList({ expos, refresh }) {
  return (
    <div className="space-y-6">
      {expos.map((expo) => (
        <div key={expo._id}>
          <h2 className="text-xl font-bold mb-2">{expo.name}</h2>
          {expo.exhibitorRequests.length === 0 && <p>No exhibitor requests yet.</p>}
          {expo.exhibitorRequests.map((req) => (
            <ExhibitorCard
              key={req.exhibitorId._id}
              exhibitor={req.exhibitorId}
              request={{ ...req, expoId: expo._id }}
              onActionSuccess={refresh}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
