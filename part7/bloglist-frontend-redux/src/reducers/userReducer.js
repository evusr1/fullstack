import { createSlice } from "@reduxjs/toolkit";

import blogsService from "../services/blogs";
import loginService from "../services/login";

import { setNotification } from "./notificationReducer";

export const initializeUser = () => {
  return async (dispatch) => {
    const loggeduserJSON = window.localStorage.getItem("loggedBlogsappUser");
    if (loggeduserJSON) {
      const userReturned = JSON.parse(loggeduserJSON);
      dispatch(setUser(userReturned));
      blogsService.setToken(userReturned.token);
    }
  };
};

export const loginUser = (username, password, cbOnSuccess) => {
  return async (dispatch) => {
    try {
      const userReturned = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBlogsappUser",
        JSON.stringify(userReturned)
      );
      blogsService.setToken(userReturned.token);

      dispatch(setUser(userReturned));
      dispatch(setNotification(`Logged in as ${userReturned.name}`));

      cbOnSuccess();
    } catch (exception) {
      if (exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedBlogsappUser");
    dispatch(setUser(null));
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
