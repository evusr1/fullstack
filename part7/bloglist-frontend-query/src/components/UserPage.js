const UserPage = ({ user }) => {
  if (!user) return;
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title} by {blog.author}
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserPage;
