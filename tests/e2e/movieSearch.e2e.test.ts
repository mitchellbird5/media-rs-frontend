import { fetchMovies } from "../../src/app/services/movieSearch";

describe("fetchMovies E2E", () => {
  const validTitle = "Toy Story (1995)";

  it("should return a list of movies for a valid title", async () => {
    const limit = 5;

    const movies = await fetchMovies(validTitle, limit);

    expect(movies).toBeDefined();
    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBeLessThanOrEqual(limit);

    // optional: check that the movie titles include the search term
    if (movies.length > 0) {
      expect(movies[0].title.toLowerCase()).toContain("toy");
    }
  });

  it("should return an empty array if no movies found", async () => {
    const title = "SomeNonExistentMovie123456";
    const movies = await fetchMovies(title, 5);

    expect(movies).toBeDefined();
    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBe(0);
  });

  it("should respect the limit parameter", async () => {
    const limit = 2;
    const movies = await fetchMovies(validTitle, limit);
    expect(movies!.length).toBeLessThanOrEqual(limit);
  });
});