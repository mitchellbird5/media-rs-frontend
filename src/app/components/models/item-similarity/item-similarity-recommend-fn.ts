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
  numRecommendations: number
): RecommendFn {
  return async () => {
    loading.emit(true);
    console.log('selectedItem = ', metaData.selectedItem);
    console.log('query = ', metaData.query)
    const query = metaData.selectedItem ?? metaData.query;
    console.log('chosen value = ', query)

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
        metaData.embeddingMethod
      );
      resultsChange.emit(results ?? []);
    } catch (error) {
      console.error('ItemSimilarity: Error fetching recommendations:', error);
    } finally {
      loading.emit(false);
    }

  };
}