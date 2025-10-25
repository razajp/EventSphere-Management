import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { ToastProvider } from "../context/ToastContext";

// Auth Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

// Organizer Pages
import OrganizerDashboard from "../pages/Organizer/Dashboard";
import ExpoList from "../pages/Organizer/expos/ExpoList";
import ExhibitorList from "../pages/Organizer/Exhibitors/ExhibitorList";

// Exhibitor Pages
import ExhibitorDashboard from "../pages/Exhibitor/Dashboard";
import ProfileSetup from "../pages/Exhibitor/ProfileSetup";
import ExposPageExhibitor from "../pages/Exhibitor/ExposPage";

// Attendee Pages
import AttendeeDashboard from "../pages/Attendee/Dashboard";
import ExposPageAttendee from "../pages/Attendee/ExposPage";
import Schedules from "../pages/Attendee/Schedules"; // future addition

// Route Protection
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* ------------------ AUTH ROUTES ------------------ */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* ------------------ ORGANIZER ROUTES ------------------ */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute allowedRoles={["organizer"]}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/expos"
                element={
                  <ProtectedRoute allowedRoles={["organizer"]}>
                    <ExpoList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/exhibitors"
                element={
                  <ProtectedRoute allowedRoles={["organizer"]}>
                    <ExhibitorList />
                  </ProtectedRoute>
                }
              />

              {/* ------------------ EXHIBITOR ROUTES ------------------ */}
              <Route
                path="/exhibitor"
                element={
                  <ProtectedRoute allowedRoles={["exhibitor"]}>
                    <ExhibitorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/exhibitor/expos"
                element={
                  <ProtectedRoute allowedRoles={["exhibitor"]}>
                    <ExposPageExhibitor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/exhibitor/profile-setup"
                element={
                  <ProtectedRoute allowedRoles={["exhibitor"]}>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />

              {/* ------------------ ATTENDEE ROUTES ------------------ */}
              <Route
                path="/attendee"
                element={
                  <ProtectedRoute allowedRoles={["attendee"]}>
                    <AttendeeDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendee/expos"
                element={
                  <ProtectedRoute allowedRoles={["attendee"]}>
                    <ExposPageAttendee />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendee/schedule"
                element={
                  <ProtectedRoute allowedRoles={["attendee"]}>
                    <Schedules />
                  </ProtectedRoute>
                }
              />

              {/* ------------------ FALLBACK ------------------ */}
              <Route
                path="*"
                element={
                  <div className="flex h-screen w-full items-center justify-center text-2xl font-semibold text-gray-700">
                    404 - Page Not Found
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
