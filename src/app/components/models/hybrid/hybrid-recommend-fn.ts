import { EventEmitter } from "@angular/core";

import { fetchHybridRecommendations } from "../../../services/recommend/get-hybrid-recommendation";

import { HybridMetaData } from "../../../types/model.types";
import { RecommendFn } from "../../../types/movies.types";

export function createHybridRecommendFn(
  metaData: HybridMetaData,
  loading: EventEmitter<boolean>,
  resultsChange: EventEmitter<string[]>,
  numRecommendations: number
): RecommendFn {
  return async () => {
    if (!metaData?.userUserCFMetaData.ratings) {
      resultsChange.emit([]);
      return;
    }

    loading.emit(true);
    try {
      const results = await fetchHybridRecommendations(
        metaData.itemItemCFMetaData.selectedItem,
        metaData.userUserCFMetaData.ratings(), 
        metaData.alpha,
        metaData.beta,
        numRecommendations,
        metaData.userUserCFMetaData.numSimilarUsers,
        metaData.userUserCFMetaData.embeddingMethod
      );

      resultsChange.emit(results ?? []);
    } finally {
      loading.emit(false);
    }
  }
}