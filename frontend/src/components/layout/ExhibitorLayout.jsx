import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ExhibitorNavbar from "./ExhibitorNavbar";
import ExhibitorSidebar from "./ExhibitorSidebar";

export default function ExhibitorLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log(user);
  

  useEffect(() => {
    if (!loading && user) {
      if (!user.profileCompleted || user.status === "pending") {
        navigate("/exhibitor/profile-setup");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen w-full bg-[#efede3] text-[#302f2c]">
      <ExhibitorSidebar />
      <div className="flex-1 flex flex-col">
        <ExhibitorNavbar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
