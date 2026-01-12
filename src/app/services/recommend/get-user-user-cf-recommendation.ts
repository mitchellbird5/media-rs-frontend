import { getBaseUrl } from "../baseUrl";

const BASE_URL = getBaseUrl();

export interface Rating {
  name: string;
  value: number;
}

export const fetchUserUserCFRecommendations = async (
  ratings: Rating[],
  numberOfRecommendations: number,
  numberOfSimilarUsers: number
): Promise<string[] | null> => {

  const payload = {
    ratings,
    top_n: numberOfRecommendations,
    k_similar_users: numberOfSimilarUsers,
  };

  console.log('Fetching recommendations with payload:', payload);

  const response = await fetch(`${BASE_URL}/recommend/user-cf/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Authorization': `Bearer ${TOKEN}`, // if needed
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(errorData)}`
    );
  }

  const data: string[] = await response.json();

  console.log('Received recommendations:', data);

  return data;
};
