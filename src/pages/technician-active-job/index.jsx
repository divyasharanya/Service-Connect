import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateBookingStatus } from "features/bookings/bookingsSlice";
import { updateBookingStatus as apiUpdateBookingStatus } from "utils/api";
import { useDispatch as useReduxDispatch } from "react-redux";
import { showError, showSuccess } from "features/notifications/notificationsSlice";

export default function TechnicianActiveJob() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const notify = useReduxDispatch();
  const booking = useSelector((s) => s.bookings.items.find((b) => b.id === id));

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="text-slate-600">Job not found.</p>
        <Link to="/technician-dashboard" className="text-blue-600 hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const markCompleted = async () => {
    try {
      await apiUpdateBookingStatus(booking.id, 'completed');
      notify(showSuccess('Job marked as completed'));
      dispatch(updateBookingStatus({ id: booking.id, status: 'completed' }));
    } catch (e) {
      notify(showError('Failed to mark job completed'));
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-semibold text-slate-800">Active Job</h1>
      <div className="mt-4 rounded-md border bg-white p-4">
        <div className="text-sm text-slate-600">Service</div>
        <div className="text-lg font-medium">{booking.serviceName}</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="text-sm text-slate-600">Customer</div>
            <div className="font-medium">{booking.customerName}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Location</div>
            <div className="font-medium">{booking.location}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-slate-600">User Location</div>
          <div className="mt-2 h-40 w-full rounded-md border bg-slate-100 grid place-items-center text-slate-500">
            Map placeholder
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={markCompleted}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Mark Completed
          </button>
        </div>
      </div>
    </div>
  );
}