import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

import { createBlog } from "../reducers/blogReducer";

const BlogList = ({ blogs, user }) => {
  if (!blogs || !user) return;

  const dispatch = useDispatch();
  const blogFormRef = useRef();

  const handleCreate = (blog) => {
    dispatch(createBlog(blog));
    blogFormRef.current.toggleVisibility();
  };

  return (
    <>
      <h2>Blogs</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default BlogList;
