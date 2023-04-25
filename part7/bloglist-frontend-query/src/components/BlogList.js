import { Link } from "react-router-dom";

import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";

const BlogList = ({ blogs, handleCreate, blogFormRef }) => {
  return (
    <>
      <Typography variant="h2" gutterBottom>
        Blogs
      </Typography>
      <Togglable buttonLabel={<AddCircleIcon />} ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default BlogList;
