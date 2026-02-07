import { getBaseUrl } from "./baseUrl";
import { MovieDataSimple, MovieData, BookData } from "../types/medium.type";

const BASE_URL = getBaseUrl();


// ----------------------------
// Fetch functions
// ----------------------------

export const fetchMedia = async (
  title: string,
  limit: number,
  medium: string
): Promise<MovieDataSimple[] | BookData[]> => {
  const query = new URLSearchParams({
    query: title,
    limit: limit.toString(),
    medium: medium
  });
  
  const response = await fetch(`${BASE_URL}/medium/search?${query.toString()}`, {
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

  const data: MovieDataSimple[] = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return data;
};

export const fetchMediumData = async (
  titles: string[],
  medium: string
): Promise<MovieData[] | BookData[]> => {
  const params = new URLSearchParams(
    titles.map((title) => ["titles", title] as [string, string])
  );
  params.append("medium", medium);

  const url = `${BASE_URL}/data?${params.toString()}`;

  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return data;
};