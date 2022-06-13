const { default: axios } = require("axios");

const POSTS_API = "https://jsonplaceholder.typicode.com/posts";

const getPostsWithComments = async (page = 1, posts = []) => {
  const params = { _page: page, _limit: 20 };
  const newPosts = await axios
    .get(POSTS_API, { params })
    .then((res) => res.data);

  if (newPosts.length === 0) return posts;

  const promises = newPosts.map(async (post) => {
    const comments = await axios
      .get(`${POSTS_API}/${post.id}/comments`)
      .then((res) => res.data);

    return { ...post, comments };
  });

  const postsWithComments = await Promise.all(promises);

  return getPostsWithComments(page + 1, [...posts, ...postsWithComments]);
};

const fetchUser = async (userId) => {
  return await axios
    .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((res) => res.data);
};

const getPostUsers = (users = []) => {
  return (post) => {
    const user = users.find((user) => user.id === post.userId);

    return { ...post, user };
  };
};

const fetchPaginate = async () => {
  const posts = await getPostsWithComments();

  const usersIds = [...new Set(posts.map((post) => post.userId))];
  const promises = usersIds.map(fetchUser);

  const users = await Promise.all(promises);

  const finalResponse = posts.map(getPostUsers(users));

  return finalResponse;
};

fetchPaginate();

module.exports = { fetchPaginate };
