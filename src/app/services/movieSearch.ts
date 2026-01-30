import { getBaseUrl } from "./baseUrl";

const BASE_URL = getBaseUrl();

// ----------------------------
// Interfaces for backend API
// ----------------------------

export interface MovieData {
  title: string;
  tmdb_id?: number;
  imdb_id?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genres?: Record<number, string>;
  overview?: string | null;
  runtime?: number | null;
  popularity?: number | null;
  release_date?: string | null;
  tagline?: string | null;
  vote_average?: number | null;
}

// Optional: You can also define a simplified movie result
export interface MovieResult {
  title: string;
  movieId: number;
}

// ----------------------------
// Fetch functions
// ----------------------------

export const fetchMovies = async (
  title: string,
  limit: number
): Promise<MovieResult[]> => {
  const query = new URLSearchParams({
    query: title,
    limit: limit.toString(),
  });

  console.log("Fetching movies with query:", `${BASE_URL}/movies/search/?${query.toString()}`);
  
  const response = await fetch(`${BASE_URL}/movies/search?${query.toString()}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(errorData)}`
    );
  }

  const data: MovieResult[] = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  console.log("Received movie data:", data);
  return data;
};

export const fetchMovieTitles = async (
  title: string,
  limit: number = 10
): Promise<string[]> => {
  const movies = await fetchMovies(title, limit);
  return movies.map((movie) => movie.title);
};

export const fetchMovieData = async (
  titles: string[]
): Promise<MovieData[]> => {
  const params = new URLSearchParams(
    titles.map((title) => ["titles", title] as [string, string])
  );

  const url = `${BASE_URL}/movies/data?${params.toString()}`;
  console.log("Fetching movie data with query:", url);

  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  console.log("Received movie data:", data);

  return data as MovieData[];
};
