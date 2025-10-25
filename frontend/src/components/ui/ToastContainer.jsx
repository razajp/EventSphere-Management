// src/components/ui/ToastContainer.jsx
import { useToast } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white font-medium ${
            toast.type === "info"
              ? "bg-blue-500"
              : toast.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          } animate-slide-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
