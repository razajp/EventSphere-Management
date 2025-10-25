// src/components/ui/ToastContainer.jsx
import { useToast } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-xl shadow text-white font-medium ${
            toast.type === "info"
              ? "bg-blue-600"
              : toast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          } animate-slide-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
