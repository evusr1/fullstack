import { createSlice } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";
import commentsService from "../services/comment";

import { setNotification } from "./notificationReducer";
import { createUserBlog, removeUserBlog } from "./usersReducer";

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll();

    dispatch(setBlogs(blogs));
    dispatch(sortBlogs());
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogsService.create(blog);

      dispatch(addBlog(createdBlog));
      dispatch(createUserBlog(createdBlog));

      dispatch(
        setNotification(`a new blog ${blog.title} by ${blog.author} added`)
      );
    } catch (exception) {
      console.log(exception);
      if (exception.response && exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
      else dispatch(setNotification("Something went wrong", "error"));
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogsService.update({
        ...blog,
        likes: blog.likes + 1,
      });
      dispatch(updateBlog(updatedBlog));
    } catch (exception) {
      if (exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
      else dispatch(setNotification("Something went wrong", "error"));
    }
  };
};

export const commentBlog = (blog, content) => {
  return async (dispatch) => {
    try {
      const newComment = await commentsService.create(blog, { content });
      const updatedBlog = { ...blog, comment: blog.comment.concat(newComment) };

      dispatch(updateBlog(updatedBlog));
      dispatch(sortBlogs());
    } catch (exception) {
      if (exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
      else dispatch(setNotification("Something went wrong", "error"));
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogsService.remove(blog);
      dispatch(removeUserBlog(blog));
      dispatch(deleteBlog(blog));
    } catch (exception) {
      if (exception.response.data.error)
        dispatch(setNotification(exception.response.data.error, "error"));
      else dispatch(setNotification("Something went wrong", "error"));
    }
  };
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return state.concat(action.payload);
    },
    updateBlog(state, action) {
      const replaced = action.payload;
      return state.map((s) => (s.id === replaced.id ? replaced : s));
    },
    deleteBlog(state, action) {
      const toBeRemovedId = action.payload.id;
      return state.filter((s) => s.id !== toBeRemovedId);
    },
    sortBlogs(state) {
      return state.sort((a, b) => b.likes - a.likes);
    },
  },
});

export const { setBlogs, addBlog, updateBlog, deleteBlog, sortBlogs } =
  blogSlice.actions;

export default blogSlice.reducer;
