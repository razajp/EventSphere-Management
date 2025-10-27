import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const called = useRef(false); // 👈 reference to prevent duplicate calls

  useEffect(() => {
    const verify = async () => {
      if (called.current) return; // 👈 Skip if already executed
      called.current = true;

      try {
        await api.get(`/auth/verify-email/${token}`);
        setVerified(true);
        addToast("Email verified successfully!", "success");
      } catch (err) {
        setVerified(false);
        addToast(err.response?.data?.message || "Verification failed", "error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, addToast]);

  if (loading) return <p className="text-center mt-10">Verifying...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        {verified ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Email Verified ✅</h2>
            <Link to="/" className="text-blue-600 hover:underline">
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Verification Failed ❌
            </h2>
            <p>Link may be expired or invalid.</p>
          </>
        )}
      </div>
    </div>
  );
}
