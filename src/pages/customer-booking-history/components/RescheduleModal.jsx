import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

const RescheduleModal = ({ booking, isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (booking) {
      try {
        const d = new Date(`${booking.date}T${booking.time}:00`);
        if (!isNaN(d.getTime())) {
          setDate(d.toISOString().slice(0,10));
          setTime(d.toISOString().slice(11,16));
        }
      } catch {}
    } else {
      setDate('');
      setTime('');
    }
  }, [booking]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!date || !time) return;
    const iso = `${date}T${time}:00`;
    onSubmit?.(iso);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold text-foreground">Reschedule Booking</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose a new date and time for your booking.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-foreground">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border p-2" required />
          </div>
          <div>
            <label className="text-sm text-foreground">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-md border p-2" required />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;