import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Users2, BarChart3, Settings } from "lucide-react";

const links = [
  { path: "/organizer", label: "Dashboard", icon: LayoutDashboard },
  { path: "/organizer/expos", label: "Expos", icon: Building2 },
  { path: "/organizer/exhibitors", label: "Exhibitors", icon: Users2 },
  { path: "/organizer/attendees", label: "Attendees", icon: Users2 },
  { path: "/organizer/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/organizer/settings", label: "Settings", icon: Settings },
];

export default function OrganizerSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-[#302f2c] text-[#efede3] flex flex-col">
      <div className="text-center text-xl font-semibold py-4 border-b border-[#efede3]/20">
        EventSphere Organizer
      </div>
      <nav className="flex-1 px-3 py-4">
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl mb-2 transition ${
              pathname === path
                ? "bg-[#efede3] text-[#302f2c] font-medium"
                : "hover:bg-[#efede3]/20"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
