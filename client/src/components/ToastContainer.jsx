import { useToast } from "../context/ToastContext";

const toastStyles = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-800",
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`text-white px-4 py-2 rounded shadow ${
            toastStyles[toast.type]
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
