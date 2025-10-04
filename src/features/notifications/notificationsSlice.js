import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ type = "info", title, message, autoHide = true, duration = 4000 }) {
        return {
          payload: {
            id: nanoid(),
            type,
            title,
            message,
            autoHide,
            duration,
            timestamp: Date.now(),
          },
        };
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Helper action creators for common toast types
export const showSuccess = (message, title) => addToast({ type: "success", title, message });
export const showError = (message, title) => addToast({ type: "error", title, message });
export const showWarning = (message, title) => addToast({ type: "warning", title, message });
export const showInfo = (message, title) => addToast({ type: "info", title, message });