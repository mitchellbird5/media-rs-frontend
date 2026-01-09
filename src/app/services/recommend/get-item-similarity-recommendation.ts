import { getBaseUrl } from "../baseUrl";

const BASE_URL = getBaseUrl();

export const fetchItemSimilarityRecommendations = async (
  title: string,
  numberOfRecommendations: number
): Promise<string[] | null> => {

  const query = new URLSearchParams({
    movie_title: title,
    top_n:numberOfRecommendations.toString(),
  });

  console.log('Fetching recommendations with query:', query.toString());
  const response = await fetch(`${BASE_URL}/recommend/content/?${query.toString()}`, {
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

  const data: string[] = await response.json();

  console.log('Received movie data:', data);

  return data;
};
