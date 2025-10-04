import React from "react";
import { cn } from "utils/cn";

export default function JobRequest({ request, onAccept, onReject, className }) {
  const { id, serviceName, customerName, date, location, status } = request;
  return (
    <div className={cn("rounded-lg border p-4 bg-white", className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800">{serviceName}</h4>
        <span className={cn(
          "rounded px-2 py-0.5 text-xs",
          status === "pending" && "bg-amber-100 text-amber-700",
          status === "accepted" && "bg-emerald-100 text-emerald-700",
          status === "completed" && "bg-slate-100 text-slate-700"
        )}>{status}</span>
      </div>
      <div className="mt-2 text-sm text-slate-600">
        <div>Customer: {customerName}</div>
        <div>Date: {new Date(date).toLocaleString()}</div>
        <div>Location: {location}</div>
      </div>
      <div className="mt-4 flex gap-2">
        {status === "pending" && (
          <>
            <button
              onClick={() => onAccept?.(id)}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
            >
              Accept
            </button>
            <button
              onClick={() => onReject?.(id)}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}