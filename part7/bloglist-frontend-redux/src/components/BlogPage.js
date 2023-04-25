import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { likeBlog, removeBlog, commentBlog } from "../reducers/blogReducer";

const BlogPage = ({ blog, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");

  if (!blog || !user) return;

  const removeButtonVisible = {
    display: blog.user && blog.user.username === user.username ? "" : "none",
  };

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };

  const addComment = (event) => {
    console.log("test");
    event.preventDefault();
    dispatch(commentBlog(blog, comment));
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog));
      navigate("/");
    }
  };
  return (
    <>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <Container>
        <Row>
          <Col>added by {blog.user ? blog.user.username : "unknown"}</Col>
        </Row>
        <Row>
          <Col>
            <a href={blog.url}>{blog.url}</a>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={handleLike}>Likes: {blog.likes}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="danger"
              onClick={handleRemove}
              style={removeButtonVisible}
            >
              remove
            </Button>
          </Col>
        </Row>
      </Container>
      <h3>comments</h3>
      <Form onSubmit={addComment}>
        <Form.Group as={Row}>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
          </Col>
          <Col sm={2}>
            <Button type="submit">add comment</Button>
          </Col>
        </Form.Group>
      </Form>
      <ul>
        {blog.comment.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </>
  );
};

export default BlogPage;
