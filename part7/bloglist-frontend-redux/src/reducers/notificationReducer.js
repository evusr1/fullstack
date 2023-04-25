import { createSlice } from "@reduxjs/toolkit";

export const setNotification = (message, type = "info") => {
  return async (dispatch) => {
    dispatch(set({ message, type }));
    setTimeout(() => {
      dispatch(clear());
    }, 5000);
  };
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear() {
      return null;
    },
  },
});

export const { set, clear } = notificationSlice.actions;
export default notificationSlice.reducer;
