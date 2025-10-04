import store from "store/store";
import { SERVICES } from "data/services";

export function computeAdminStats() {
  const state = store.getState();
  const bookings = state.bookings.items || [];

  const servicePrice = SERVICES.reduce((acc, s) => {
    acc[s.name] = s.priceFrom || 0;
    return acc;
  }, {});

  let totalRevenue = 0;
  let activeCount = 0;
  let completedCount = 0;

  bookings.forEach((b) => {
    if (b.status === "accepted") activeCount += 1;
    if (b.status === "completed") {
      completedCount += 1;
      totalRevenue += servicePrice[b.serviceName] || 0;
    }
  });

  return { totalRevenue, activeCount, completedCount };
}