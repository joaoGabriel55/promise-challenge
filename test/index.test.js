const { fetchPaginate } = require("../index.js");
const {
  fetchComments,
  fetchPosts,
  fetchUser,
} = require("../services/index.js");
const commentsMock = require("./__mocks__/comments.json");
const postsMock = require("./__mocks__/posts.json");

jest.mock("../services/index.js", () => ({
  fetchPosts: jest.fn(),
  fetchComments: jest.fn(),
  fetchUser: jest.fn(),
}));

const setupMock = () => {
  fetchPosts.mockImplementation(async (page) => {
    if (page > 5) return await Promise.resolve([]);
    else return await Promise.resolve(postsMock);
  });

  fetchComments.mockImplementation(async (_) => {
    return await Promise.resolve(commentsMock);
  });

  fetchUser.mockImplementation(async (userId) => {
    return await Promise.resolve({
      id: userId,
      name: "John Doe",
    });
  });
};

describe("Promise", () => {
  it("api request", async () => {
    setupMock();

    const postsResult = await fetchPaginate();

    expect(postsResult.length).toBe(100);

    postsResult.forEach((post) => {
      expect(post.user).not.toBeNull();
      expect(post.comments.length).toBeGreaterThan(0);
    });
  });
});
