import { getBaseUrl } from "../baseUrl";

const BASE_URL = getBaseUrl();

export interface Rating {
  name: string;
  value: number;
}

export const fetchUserUserCFRecommendations = async (
  ratings: Rating[],
  numberOfRecommendations: number,
  numberOfSimularUsers: number
): Promise<string[] | null> => {

  const query = new URLSearchParams({
    ratings: JSON.stringify(ratings),
    top_n: numberOfRecommendations.toString(),
    k_similar_users: numberOfSimularUsers.toString()
  });

  console.log('Fetching recommendations with query:', query.toString());
  const response = await fetch(`${BASE_URL}/recommend/user-cf/?${query.toString()}`, {
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
