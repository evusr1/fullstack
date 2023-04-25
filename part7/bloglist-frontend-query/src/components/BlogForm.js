import { useState } from "react";
import PropTypes from "prop-types";

import { Button, TextField, Typography } from "@mui/material";

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
      <Typography variant="h6" gutterBottom>
        Add Blog
      </Typography>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            variant="standard"
            label="title"
            value={title}
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="author"
            value={author}
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="url"
            value={url}
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            id="create-button"
          >
            create
          </Button>
        </div>
      </form>
    </>
  );
};

PropTypes.propTypes = {
  handleCreate: PropTypes.func.isRequired,
};

export default BlogForm;
