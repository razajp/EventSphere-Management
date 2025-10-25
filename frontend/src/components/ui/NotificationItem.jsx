export default function NotificationItem({ notification }) {
  return (
    <div
      className={`p-3 border-b cursor-pointer transition-colors ${
        notification.read ? "bg-gray-50" : "bg-white font-semibold"
      } hover:bg-gray-100`}
    >
      {notification.message}
      <div className="text-xs text-gray-400 mt-1">
        {new Date(notification.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
