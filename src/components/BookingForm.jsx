import React, { useState } from "react";
import { SERVICES } from "data/services";

export default function BookingForm({ onSubmit }) {
  const [serviceId, setServiceId] = useState(SERVICES[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const svc = SERVICES.find((s) => s.id === serviceId);
    onSubmit?.({
      serviceId,
      serviceName: svc?.name,
      date: new Date(`${date}T${time}`).toISOString(),
      location,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Service</label>
        <select
          className="mt-1 w-full rounded-md border p-2"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded-md border p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Time</label>
          <input
            type="time"
            className="mt-1 w-full rounded-md border p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Location</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border p-2"
          placeholder="City / Address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Book Service
        </button>
      </div>
    </form>
  );
}