import React, { useMemo } from "react";
import { useSelector } from "react-redux";

export default function TechnicianWallet() {
  const tech = useSelector((s) => s.auth.user);
  const technicianId = tech?.role === "technician" ? tech.id : "tech_1";
  const bookings = useSelector((s) => s.bookings.items);
  const techEntry = useSelector((s) => s.technicians.list.find((t) => t.id === technicianId));

  const earnings = useMemo(() => {
    if (techEntry?.earnings) return techEntry.earnings;
    // fallback: compute ₹ amount per completed booking
    const completed = bookings.filter((b) => b.technicianId === technicianId && b.status === "completed");
    return completed.length * 250; // mock rate
  }, [bookings, techEntry, technicianId]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-semibold text-slate-800">Wallet</h1>
      <div className="mt-4 rounded-md border bg-white p-6">
        <div className="text-sm text-slate-600">Current Balance</div>
        <div className="mt-1 text-3xl font-bold">₹{earnings.toFixed(2)}</div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border p-4">
            <div className="text-sm text-slate-600">Payout Method</div>
            <div className="font-medium">Bank Transfer (mock)</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-slate-600">Last Payout</div>
            <div className="font-medium">₹0.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}