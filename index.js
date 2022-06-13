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

const getPostUsers = () => {
  const usersLoaded = {};

  return async (post) => {
    const userLoaded = usersLoaded[post.userId];

    if (userLoaded) return { ...post, user: userLoaded };

    const user = await fetchUser(post.userId);

    usersLoaded[user.id] = user;

    return { ...post, user };
  };
};

const fetchPaginate = async () => {
  const posts = await getPostsWithComments();

  const promises = posts.map(getPostUsers());

  const finalResponse = await Promise.all(promises);

  return finalResponse;
};

fetchPaginate();

module.exports = { fetchPaginate };
