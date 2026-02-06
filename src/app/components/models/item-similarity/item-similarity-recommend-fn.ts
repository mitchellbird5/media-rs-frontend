import { EventEmitter } from "@angular/core";

import { 
  fetchItemSimilarityRecommendations, 
  fetchItemSimilarityDescriptionRecommendations 
} from "../../../services/recommend/get-item-similarity-recommendation";

import { ItemSimilarityMetaData } from "../../../types/model.types";
import { RecommendFn } from "../../../types/movies.types";

export function createItemSimilarityRecommendFn(
  metaData: ItemSimilarityMetaData,
  loading: EventEmitter<boolean>,
  resultsChange: EventEmitter<string[]>,
  numRecommendations: number,
  medium: string
): RecommendFn {
  return async () => {
    loading.emit(true);
    const query = metaData.selectedItem ?? metaData.query;

    if (!query) {
      loading.emit(false);
      return;
    } 

    const method = metaData.selectedItem
      ? fetchItemSimilarityRecommendations
      : fetchItemSimilarityDescriptionRecommendations;

    try {
      const results = await method(
        query, 
        numRecommendations, 
        metaData.embeddingMethod,
        medium
      );
      resultsChange.emit(results ?? []);
    } catch (error) {
    } finally {
      loading.emit(false);
    }

  };
}