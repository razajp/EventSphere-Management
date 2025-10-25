import OrganizerNavbar from "./OrganizerNavbar";
import OrganizerSidebar from "./OrganizerSidebar";

export default function OrganizerLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#efede3] text-[#302f2c]">
      <OrganizerSidebar />
      <div className="flex-1 flex flex-col">
        <OrganizerNavbar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
