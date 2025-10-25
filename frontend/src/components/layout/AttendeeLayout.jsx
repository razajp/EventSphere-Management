import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AttendeeNavbar from "./AttendeeNavbar";
import AttendeeSidebar from "./AttendeeSidebar";

export default function AttendeeLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "attendee")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen w-full bg-[#efede3] text-[#302f2c]">
      <AttendeeSidebar />
      <div className="flex-1 flex flex-col">
        <AttendeeNavbar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
