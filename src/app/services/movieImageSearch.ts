import { getBaseUrl } from "./baseUrl";

const BASE_URL = getBaseUrl();

export const fetchMovieImages = async (
  titles: string[],
): Promise<string[]> => {

  const params = new URLSearchParams();

  for (const title of titles) {
    params.append("titles", title);
  }

  const url = `${BASE_URL}/movies/images/?${params.toString()}`;

  console.log("Fetching movie images:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return data;
};
