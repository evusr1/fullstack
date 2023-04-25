import { useState, useEffect } from "react";
import { Routes, Route, useMatch, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Navbar, Nav, Container, Alert, Form } from "react-bootstrap";

import BlogList from "./components/BlogList";
import BlogPage from "./components/BlogPage";
import UserPage from "./components/UserPage";
import UserList from "./components/UserList";

import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/usersReducer";

const Notification = ({ notification }) => {
  if (!notification) return;
  const variant = notification.type === "error" ? "danger" : "success";

  return (
    <Alert key={variant} variant={variant}>
      {notification.message}
    </Alert>
  );
};

const App = () => {
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);
  const notification = useSelector((state) => state.notification);

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
    dispatch(initializeUsers());
  }, [dispatch]);

  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(
      loginUser(username, password, () => {
        setUsername("");
        setPassword("");
      })
    );
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const matchUser = useMatch("/users/:id");
  const matchBlog = useMatch("/blogs/:id");

  const viewWhatUser = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null;

  const viewWhatBlog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null;

  const loginForm = () => (
    <>
      <Notification notification={notification} />
      <Container>
        <h2>login to application</h2>

        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Button type="submit" id="login-button">
              login
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );

  if (!user) return loginForm();

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Navbar.Brand href="#">blogs app</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link href="#" as="span">
                <Link to="/">Blogs</Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#" as="span">
                <Link to="/users">Users</Link>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item>
              <Navbar.Text>
                {user.name} logged in{" "}
                <Button variant="danger" onClick={handleLogout}>
                  logout
                </Button>
              </Navbar.Text>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Notification notification={notification} />
      <Container>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} user={user} />} />
          <Route path="/users" element={<UserList users={users} />} />
          <Route path="/users/:id" element={<UserPage user={viewWhatUser} />} />
          <Route
            path="/blogs/:id"
            element={<BlogPage blog={viewWhatBlog} user={user} />}
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
