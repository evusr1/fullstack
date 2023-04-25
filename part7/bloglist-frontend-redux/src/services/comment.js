import axios from "axios";
const baseUrl = "/api/blogs";

const create = async (blog, newObject) => {
  const response = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    newObject
  );
  return response.data;
};

export default { create };
