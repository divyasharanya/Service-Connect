import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "features/notifications/notificationsSlice";
import { cn } from "utils/cn";
import Icon from "./AppIcon";

export default function Toast() {
  const dispatch = useDispatch();
  const toasts = useSelector((s) => s.notifications.toasts);

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return "CheckCircle2";
      case "error":
        return "XCircle";
      case "warning":
        return "AlertTriangle";
      case "info":
      default:
        return "Info";
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "error":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "info":
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const handleDismiss = (id) => {
    dispatch(removeToast(id));
  };

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={handleDismiss}
          icon={getToastIcon(toast.type)}
          styles={getToastStyles(toast.type)}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss, icon, styles }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast.autoHide) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.autoHide, toast.duration, dispatch]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-slide-in min-w-80 max-w-md",
        styles
      )}
    >
      <Icon name={icon} size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {toast.title && <div className="font-medium">{toast.title}</div>}
        <div className={cn("text-sm", toast.title && "mt-1")}>{toast.message}</div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <Icon name="X" size={14} />
      </button>
    </div>
  );
}