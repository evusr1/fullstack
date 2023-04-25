import { useState, useEffect, useReducer, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import {
  Container,
  AppBar,
  IconButton,
  Toolbar,
  Button,
  Typography,
  TextField,
  Paper,
  Box,
} from "@mui/material";

import { useNotificationDispatch } from "./NotificationContext";

import Notification from "./components/Notification";
import UserPage from "./components/UserPage";
import UserList from "./components/UserList";
import BlogPage from "./components/BlogPage";
import BlogList from "./components/BlogList";

import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
import commentsService from "./services/comment";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return null;
    default:
      return state;
  }
};

const usersReducer = (state = null, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return null;
    case "REMOVEBLOG": {
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
    }
    case "CREATEBLOG": {
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
    }
    default:
      return state;
  }
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, userDispatch] = useReducer(userReducer, null);
  const [users, usersDispatch] = useReducer(usersReducer, null);

  const notificationDispatch = useNotificationDispatch();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const result = useQuery("blogs", async () => {
    const returnedBlogs = await blogService.getAll();
    return returnedBlogs.sort((a, b) => b.likes - a.likes);
  });
  const notifyWith = (message, type = "info") => {
    notificationDispatch({
      type: "SET",
      payload: {
        message,
        type,
      },
    });

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 3000);
  };

  const blogsMutationCreate = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries();
      usersDispatch({ type: "CREATEBLOG", payload: newBlog });
      notifyWith(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    },
    onError: (response) => notifyWith(response.response.data.error, "error"),
  });

  const blogsMutationRemove = useMutation(
    async (removeBlog) => {
      const removeResult = await blogService.remove(removeBlog);
      usersDispatch({ type: "REMOVEBLOG", payload: removeBlog });
      return removeResult;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
      onError: (response) => notifyWith(response.response.data.error, "error"),
    }
  );

  const blogsMutationModify = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (response) => notifyWith(response.response.data.error, "error"),
  });

  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");

  const userToView = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const initializeUser = () => {
    const loggeduserJSON = window.localStorage.getItem("loggedBlogsappUser");
    if (loggeduserJSON) {
      const userReturned = JSON.parse(loggeduserJSON);
      userDispatch({ type: "SET", payload: userReturned });
      blogService.setToken(userReturned.token);
    }
  };

  const initializeUsers = async () => {
    const usersReturned = await usersService.getAll();
    usersDispatch({ type: "SET", payload: usersReturned });
  };

  const userSet = (user) => userDispatch({ type: "SET", payload: user });

  useEffect(() => {
    initializeUser();
    initializeUsers();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userReturned = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBlogsappUser",
        JSON.stringify(userReturned)
      );
      blogService.setToken(userReturned.token);

      userSet(userReturned);
      setUsername("");
      setPassword("");
      notifyWith(`Logged in as ${userReturned.name}`);
    } catch (exception) {
      if (exception.response.data.error)
        notifyWith(exception.response.data.error, "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogsappUser");
    userSet(null);
  };

  const blogFormRef = useRef();

  const handleCreate = (newBlog) => {
    blogsMutationCreate.mutate(newBlog);
    blogFormRef.current.toggleVisibility();
  };

  const handleLike = (oldBlog) => {
    blogsMutationModify.mutate({
      ...oldBlog,
      likes: oldBlog.likes + 1,
      user: oldBlog.user ? oldBlog.user.id : null,
    });
  };

  const handleRemove = (removeBlog) => {
    if (
      window.confirm(`Remove blog ${removeBlog.title} by ${removeBlog.author}`)
    ) {
      blogsMutationRemove.mutate(removeBlog);
      navigate("/");
    }
  };

  const handleComment = async (blog, content) => {
    try {
      const newComment = await commentsService.create(blog, { content });
      const updatedBlog = { ...blog, comment: blog.comment.concat(newComment) };
      blogsMutationModify.mutate(updatedBlog);
    } catch (exception) {
      if (exception.response.data.error)
        notifyWith(exception.response.data.error, "error");
      else notifyWith("Something went wrong", "error");
    }
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const blogs = result.data;
  const blogToMatch = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  const loginForm = () => (
    <Container>
      <Notification />
      <Paper
        component="form"
        onSubmit={handleLogin}
        sx={{ flexGrow: 1, overflow: "hidden", px: 3, maxWidth: 500 }}
      >
        <Typography variant="h2" gutterBottom>
          Login
        </Typography>
        <Box>
          <TextField
            variant="standard"
            label="Username"
            value={username}
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Box>
        <Box>
          <TextField
            variant="standard"
            label="Password"
            value={password}
            id="password"
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          m={2}
        >
          <Button type="submit" id="login-button" variant="contained">
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );

  if (!user) return loginForm();

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Blogs App - {user.name}
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Notification />
      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              handleCreate={handleCreate}
              blogFormRef={blogFormRef}
            />
          }
        />
        <Route path="/login" element={loginForm()} />
        <Route path="/users" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserPage user={userToView} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogPage
              blog={blogToMatch}
              user={user}
              handleLike={handleLike}
              handleComment={handleComment}
              handleRemove={handleRemove}
            />
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
