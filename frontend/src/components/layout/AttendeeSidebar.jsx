import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users2,
  BarChart3,
  Settings,
} from "lucide-react";

const links = [
  { path: "/attendee", label: "Dashboard", icon: LayoutDashboard },
  { path: "/attendee/expos", label: "Expos", icon: Building2 },
  { path: "/attendee/schedule", label: "Schedule", icon: CalendarDays },
  { path: "/attendee/community", label: "Community", icon: Users2 },
  { path: "/attendee/insights", label: "Insights", icon: BarChart3 },
  { path: "/attendee/settings", label: "Settings", icon: Settings },
];

export default function AttendeeSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-[#302f2c] text-[#efede3] flex flex-col">
      {/* Header */}
      <div className="text-center text-xl font-semibold py-4 border-b border-[#efede3]/20">
        EventSphere Attendee
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ path, label, icon: Icon }) => {
          const isActive =
            pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center justify-between group px-4 py-2 rounded-xl mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-[#efede3] text-[#302f2c] font-medium shadow-sm"
                  : "hover:bg-[#efede3]/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={`${
                    isActive
                      ? "text-[#302f2c]"
                      : "text-[#efede3]/80 group-hover:text-[#efede3]"
                  }`}
                />
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="text-center text-xs text-[#efede3]/60 pb-4 border-t border-[#efede3]/10 mt-auto">
        © {new Date().getFullYear()} EventSphere
      </div>
    </aside>
  );
}
