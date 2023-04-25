import { createSlice } from "@reduxjs/toolkit";

import { setNotification } from "./notificationReducer";

import usersService from "../services/users";

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await usersService.getAll();
      dispatch(setUsers(users));
    } catch (exception) {
      if (exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
    }
  };
};

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
    createUserBlog(state, action) {
      const blog = action.payload;
      return state.map((user) => {
        if (user.id === blog.user.id) {
          const updatedUser = {
            ...user,
            blogs: user.blogs.concat(blog),
          };
          return updatedUser;
        }
        return user;
      });
    },
    removeUserBlog(state, action) {
      const blogToRemove = action.payload;

      return state.map((user) => {
        if (user.id === blogToRemove.user.id) {
          const updatedUser = {
            ...user,
            blogs: user.blogs.filter((blog) => blog.id !== blogToRemove.id),
          };
          return updatedUser;
        }
        return user;
      });
    },
  },
});

export const { setUsers, createUserBlog, removeUserBlog } = usersSlice.actions;
export default usersSlice.reducer;
