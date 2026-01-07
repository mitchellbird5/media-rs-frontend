import { getBaseUrl } from "./baseUrl";

const BASE_URL = getBaseUrl();

interface movieResult {
  title: string;
  movieId: number;
}

export const fetchMovies = async (
  title: string,
  limit: number
): Promise<movieResult[]> => {

  const query = new URLSearchParams({
    query: title,
    limit: limit.toString(),
  });

  console.log('Fetching movies with query:', `${BASE_URL}/movies/search/?${query.toString()}`);
  const response = await fetch(`${BASE_URL}/movies/search/?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // Add auth header if your API requires it
      // 'Authorization': `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(errorData)}`
    );
  }

  const data: movieResult[] = await response.json();

  console.log('Received movie data:', data);

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return data;
};

export const fetchMovieTitles = async (
  title: string,
  limit: number = 10
): Promise<string[]> => {
  const movies = await fetchMovies(title, limit);
  return movies.map((movie) => movie.title);
};
