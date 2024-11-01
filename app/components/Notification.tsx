import { useEffect, useState } from "react";

type NotificationProps = {
  message: string;
  duration?: number;
  onClose: () => void;
  status: "success" | "error";
};

const Notification: React.FC<NotificationProps> = ({
  message,
  duration = 3000,
  onClose,
  status,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const hideTimer = setTimeout(() => setIsVisible(false), duration - 500);
    const closeTimer = setTimeout(onClose, duration);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const backgroundColorClass =
    status === "success" ? "bg-primary border-hover" : "bg-red-200 border-100";

  return (
    <div
      className={`fixed bottom-4 right-4 text-white p-4 rounded-xl border-2 shadow transition-opacity duration-500 ${backgroundColorClass} ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
