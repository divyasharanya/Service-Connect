import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pendingApprovals: [],
  status: "idle",
  error: null,
};

const techniciansSlice = createSlice({
  name: "technicians",
  initialState,
  reducers: {
    setTechnicians(state, action) {
      state.list = action.payload;
    },
    addTechnician: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare(tech) {
        return { payload: { id: nanoid(), verified: false, earnings: 0, ...tech } };
      },
    },
    setPendingApprovals(state, action) {
      state.pendingApprovals = action.payload;
    },
    approveTechnician(state, action) {
      const id = action.payload;
      const t = state.list.find((x) => x.id === id);
      if (t) t.verified = true;
      state.pendingApprovals = state.pendingApprovals.filter((x) => x.id !== id);
    },
    rejectTechnician(state, action) {
      const id = action.payload;
      state.pendingApprovals = state.pendingApprovals.filter((x) => x.id !== id);
    },
    setTechniciansStatus(state, action) {
      state.status = action.payload;
    },
    setTechniciansError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setTechnicians,
  addTechnician,
  setPendingApprovals,
  approveTechnician,
  rejectTechnician,
  setTechniciansStatus,
  setTechniciansError,
} = techniciansSlice.actions;
export default techniciansSlice.reducer;