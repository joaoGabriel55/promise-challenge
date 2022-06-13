const { fetchPaginate } = require(".");

jest.setTimeout(1000000000);

describe("Promise", () => {
  it("api request", async () => {
    const postsResult = await fetchPaginate();

    expect(postsResult.length).toBe(100);

    postsResult.forEach(post => {
      expect(post.user).not.toBeNull();
      expect(post.comments.length).toBeGreaterThan(0);
    })
  });
});
