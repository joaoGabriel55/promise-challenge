import axios from "axios";

const POSTS_API = "https://jsonplaceholder.typicode.com/posts";

 const fetchPosts = async (page) => {
  const params = { _page: page, _limit: 20 };

  return await axios.get(POSTS_API, { params }).then((res) => res.data);
};

 const fetchComments = (postId) => {
  return  await axios
  .get(`${POSTS_API}/${postId}/comments`)
  .then((res) => res.data);
}

 const fetchUser = async (userId) => {
  return await axios
    .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((res) => res.data);
};


module.exports = {
  fetchPosts,
  fetchComments,
  fetchUser,
}