import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import api from "../../utils/api";
import NotificationItem from "./NotificationItem";
import { Bell } from "lucide-react"

export default function Notifications() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const panelRef = useRef(null);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for realtime notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setToast(notif);
      setTimeout(() => setToast(null), 3000);
    });

    return () => socket.off("notification");
  }, [socket]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (panelOpen) {
          markAllAsRead();
        }
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen, notifications]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
    if (unreadIds.length > 0) {
      try {
        await Promise.all(
          unreadIds.map((id) => api.put(`/notifications/read/${id}`))
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Toggle panel
  const togglePanel = () => setPanelOpen(!panelOpen);

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell */}
      <button
        onClick={togglePanel}
        className="relative p-2 rounded-full hover:bg-gray-200 transition"
      >
        <Bell size={18} />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-5 bg-white shadow-md border rounded px-4 py-2 animate-slide-in">
          {toast.message}
        </div>
      )}

      {/* Notification Panel */}
      {panelOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border shadow-lg rounded z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <NotificationItem key={notif._id} notification={notif} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
