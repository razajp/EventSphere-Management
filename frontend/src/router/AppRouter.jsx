// src/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { ToastProvider } from "../context/ToastContext";
import ToastContainer from "../components/ui/ToastContainer";

// Auth Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ResendVerification from "../pages/Auth/ResendVerification";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

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
import Schedules from "../pages/Attendee/Schedules";

// Route Protection
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            {/* Toast container is mounted once globally */}
            <ToastContainer />

            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

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
