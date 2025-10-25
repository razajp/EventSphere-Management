import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLoginAs = (role) => {
    if (role === "organizer") navigate("/login?role=organizer");
    else if (role === "exhibitor") navigate("/login?role=exhibitor");
    else navigate("/login?role=attendee");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#efede3] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#302f2c]">
          Welcome to Expo Management
        </h1>
      </div>
    </div>
  );
}
