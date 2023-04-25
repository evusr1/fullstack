import { useState } from "react";
import { Form, Button } from "react-bootstrap";

import PropTypes from "prop-types";

const BlogForm = ({ handleCreate }) => {
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    handleCreate({ url, title, author });

    setUrl("");
    setAuthor("");
    setTitle("");
  };

  return (
    <>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button type="submit" id="create-button">
            create
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

PropTypes.propTypes = {
  handleCreate: PropTypes.func.isRequired,
};

export default BlogForm;
