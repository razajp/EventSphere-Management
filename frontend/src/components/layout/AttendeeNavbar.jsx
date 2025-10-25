import { useAuth } from "../../context/AuthContext";
import Notifications from "../ui/Notifications";

export default function AttendeeNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-3.5 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Attendee Panel</h1>
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Notifications />

        <span className="text-[#302f2c] font-medium">{user?.name}</span>

        <button
          onClick={logout}
          className="bg-[#302f2c] text-[#efede3] px-3 py-1 rounded-md hover:opacity-80"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
