import { getBaseUrl } from "../baseUrl";
import { EmbeddingMethod } from "../../types/model.types";
import { Rating } from "../../types/model.types";

const BASE_URL = getBaseUrl();

export const fetchUserUserCFRecommendations = async (
  ratings: Rating[],
  numberOfRecommendations: number,
  numberOfSimilarUsers: number,
  embeddingMethod: EmbeddingMethod
): Promise<string[] | null> => {

  const payload = {
    ratings: ratings,
    top_n: numberOfRecommendations,
    k_similar_users: numberOfSimilarUsers,
    embedding_method: embeddingMethod
  };

  console.log('Fetching recommendations with payload:', payload);

  const response = await fetch(`${BASE_URL}/recommend/user-cf`, {
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
