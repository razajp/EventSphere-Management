import React, { useState } from "react";
import api from "../../utils/api";
import Button from "../ui/Button";

export default function RequestButton({ expo, refreshExpos }) {
  const [loading, setLoading] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Find exhibitor request for this user
  const requestObj = expo.exhibitorRequests?.find(
    (r) => r.exhibitorId === user.id
  );

  // Find approved exhibitor (exists in exhibitors list)
  const approvedObj = expo.exhibitors?.find((e) => e._id === user.id);

  // Determine request status
  const status = approvedObj
    ? "approved"
    : requestObj?.status || "not requested";

  // 🧩 FIXED: Find booth number for approved exhibitor
  const boothNumber =
    requestObj?.status === "approved" ? requestObj.boothNumber : null;

  // Compute available booths
  const takenBooths = expo.exhibitorRequests.map((r) => r.boothNumber);
  const availableBooths = [];
  for (let i = expo.boothStart; i <= expo.boothEnd; i++) {
    if (!takenBooths.includes(i)) availableBooths.push(i);
  }

  const handleRequest = async () => {
    if (!selectedBooth) return alert("Please select a booth");
    setLoading(true);
    try {
      await api.post(`/expos/request/${expo._id}`, { selectedBooth });
      refreshExpos();
      setSelectedBooth("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  // 💬 UI
  if (status === "approved")
    return (
      <p className="text-green-600 font-medium">
        ✅ You are approved for Booth #{boothNumber || "?"}
      </p>
    );

  if (status === "rejected")
    return (
      <p className="text-red-600 font-medium">
        ❌ Your request was rejected
      </p>
    );

  if (status === "pending")
    return (
      <p className="text-yellow-600 font-medium">
        ⏳ Your request is pending
      </p>
    );

  // status === not requested
  return (
    <div className="mt-2 flex flex-col gap-2">
      {availableBooths.length > 0 ? (
        <>
          <select
            value={selectedBooth}
            onChange={(e) => setSelectedBooth(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select Booth</option>
            {availableBooths.map((b) => (
              <option key={b} value={b}>
                Booth #{b}
              </option>
            ))}
          </select>
          <Button onClick={handleRequest} disabled={loading || !selectedBooth}>
            {loading ? "Requesting..." : "Request to Join"}
          </Button>
        </>
      ) : (
        <p className="text-gray-500">No booths available</p>
      )}
    </div>
  );
}
