import React from "react";
import { cn } from "utils/cn";

export default function ServiceCard({ service, onSelect, className }) {
  const { name, description, priceFrom, icon } = service;
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-subtle hover:shadow-elevated transition-shadow bg-white",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl" aria-hidden>
          {icon || "🛠️"}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-600">Starts at ₹{priceFrom}</span>
        {onSelect && (
          <button
            onClick={() => onSelect(service)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
}