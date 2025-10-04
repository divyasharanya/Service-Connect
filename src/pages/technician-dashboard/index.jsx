import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobRequest from "components/JobRequest";
import { getBookings } from "utils/api";
import { setBookings, setBookingsStatus, updateBookingStatus } from "features/bookings/bookingsSlice";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const { items: bookings, status } = useSelector((s) => s.bookings);
  const authUser = useSelector((s) => s.auth.user);

  const technicianId = authUser?.role === "technician" ? authUser.id : "tech_1"; // fallback mock

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        dispatch(setBookingsStatus("loading"));
        const data = await getBookings();
        if (mounted) dispatch(setBookings(data));
      } catch (e) {
        dispatch(setBookingsStatus("error"));
      } finally {
        dispatch(setBookingsStatus("idle"));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const myIncoming = bookings.filter((b) => b.technicianId === technicianId && b.status === "pending");

  const onAccept = (id) => dispatch(updateBookingStatus({ id, status: "accepted" }));
  const onReject = (id) => dispatch(updateBookingStatus({ id, status: "rejected" }));

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold text-slate-800">Incoming Job Requests</h1>
      {status === "loading" && <p className="mt-4 text-slate-500">Loading...</p>}
      <div className="mt-4 grid grid-cols-1 gap-4">
        {myIncoming.length === 0 && (
          <div className="rounded-md border bg-white p-6 text-slate-600">No pending requests.</div>
        )}
        {myIncoming.map((req) => (
          <JobRequest key={req.id} request={req} onAccept={onAccept} onReject={onReject} />
        ))}
      </div>
    </div>
  );
}