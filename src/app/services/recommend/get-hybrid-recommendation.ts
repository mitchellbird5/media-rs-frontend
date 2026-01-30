import { getBaseUrl } from "../baseUrl";
import { EmbeddingMethod } from "../../types/model.types";
import { Rating } from "../../types/model.types";

const BASE_URL = getBaseUrl();

export const fetchHybridRecommendations = async (
  title: string | null,
  ratings: Rating[],
  alpha: number,
  beta: number,
  numberOfRecommendations: number,
  numberOfSimilarUsers: number,
  embeddingMethod: EmbeddingMethod
): Promise<string[] | null> => {
  if (!title) return null;

  const payload = {
    movie_title: title,
    alpha: alpha,
    beta: beta,
    ratings: ratings,
    top_n: numberOfRecommendations,
    k_similar_users: numberOfSimilarUsers,
    embedding_method: embeddingMethod
  };

  const response = await fetch(`${BASE_URL}/recommend/hybrid`, {
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

  return data;
};
