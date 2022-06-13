const { fetchComments, fetchPosts, fetchUser } = require("./services/index.js");

const getPostsWithComments = async (page = 1, posts = []) => {
  const newPosts = await fetchPosts(page);

  if (newPosts.length === 0) return posts;

  const promises = newPosts.map(async (post) => {
    const comments = await fetchComments(post.id);

    return { ...post, comments };
  });

  const postsWithComments = await Promise.all(promises);

  return getPostsWithComments(page + 1, [...posts, ...postsWithComments]);
};

const getPostUsers = (users = []) => {
  return (post) => {
    const user = users.find((user) => user.id === post.userId);

    if (!user) return post;

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

module.exports = { fetchPaginate };
