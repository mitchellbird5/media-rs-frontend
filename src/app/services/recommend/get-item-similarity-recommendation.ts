import { getBaseUrl } from "../baseUrl";
import { EmbeddingMethod } from "../../types/model.types";

const BASE_URL = getBaseUrl();

export const fetchItemSimilarityRecommendations = async (
  title: string,
  numberOfRecommendations: number,
  embeddingMethod: EmbeddingMethod,
  medium: string
): Promise<string[] | null> => {

  const query = new URLSearchParams({
    title: title,
    medium: medium,
    top_n:numberOfRecommendations.toString(),
    embedding_method: embeddingMethod
  });

  const response = await fetch(`${BASE_URL}/recommend/content?${query.toString()}`, {
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

  return data;
};

export const fetchItemSimilarityDescriptionRecommendations = async (
  description: string,
  numberOfRecommendations: number,
  embeddingMethod: 'SBERT' | 'TFIDF',
  medium: string
): Promise<string[] | null> => {

  const query = new URLSearchParams({
    description: description,
    top_n: numberOfRecommendations.toString(),
    embedding_method: embeddingMethod,
    medium: medium
  });

  const response = await fetch(`${BASE_URL}/recommend/content-description?${query.toString()}`, {
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

  return data;
};
