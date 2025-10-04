import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings(state, action) {
      state.items = action.payload;
    },
    addBooking: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(booking) {
        return { payload: { id: nanoid(), status: "pending", rating: null, review: "", ...booking } };
      },
    },
    updateBookingStatus(state, action) {
      const { id, status } = action.payload;
      const b = state.items.find((x) => x.id === id);
      if (b) b.status = status;
    },
    addRating(state, action) {
      const { id, rating, review } = action.payload;
      const b = state.items.find((x) => x.id === id);
      if (b) {
        b.rating = rating;
        b.review = review || b.review;
      }
    },
    setBookingsStatus(state, action) {
      state.status = action.payload;
    },
    setBookingsError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBookingStatus,
  addRating,
  setBookingsStatus,
  setBookingsError,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;