import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "features/auth/authSlice";
import bookingsReducer from "features/bookings/bookingsSlice";
import techniciansReducer from "features/technicians/techniciansSlice";
import notificationsReducer from "features/notifications/notificationsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingsReducer,
  technicians: techniciansReducer,
  notifications: notificationsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "bookings", "technicians"], // persist auth and cache bookings/technicians; others can be fetched
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable actions
    }),
});

export const persistor = persistStore(store);
export default store;
