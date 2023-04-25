import { useState } from "react";
import {
  IconButton,
  Badge,
  InputBase,
  Stack,
  Box,
  Paper,
  CardActions,
  Typography,
  CardContent,
  Card,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";

const BlogPage = ({ blog, user, handleLike, handleRemove, handleComment }) => {
  const [comment, setComment] = useState("");

  if (!blog || !user) return;

  const removeButtonVisible = {
    display: blog.user && blog.user.username === user.username ? "" : "none",
  };

  return (
    <>
      <Box mt={5}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Added by {blog.user ? blog.user.username : "unknown"}
            </Typography>
            <Typography variant="h5" component="div">
              {blog.title}
              <Badge badgeContent={blog.likes} color="secondary">
                <IconButton onClick={() => handleLike(blog)}>
                  <ThumbUpIcon />
                </IconButton>
              </Badge>
              <IconButton
                aria-label="delete"
                onClick={() => handleRemove(blog)}
                style={removeButtonVisible}
              >
                <DeleteIcon />
              </IconButton>
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {blog.author}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" component={Link} to={blog.url}>
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box>
        <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
          {blog.comment.map((comment) => (
            <Paper
              key={comment.id}
              sx={{
                my: 1,
                mx: "auto",
                p: 2,
              }}
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Stack>{comment.content}</Stack>
              </Stack>
            </Paper>
          ))}
        </Box>
        <Paper
          component="form"
          onSubmit={() => handleComment(blog, comment)}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            mt: 5,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Say something..."
          />
          <IconButton type="submit" sx={{ p: "10px" }}>
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </>
  );
};

export default BlogPage;
