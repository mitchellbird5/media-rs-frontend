import { EventEmitter } from "@angular/core";

import { fetchUserUserCFRecommendations } from "../../../services/recommend/get-user-user-cf-recommendation";

import { UserUserCFMetaData, RecommendFn } from "../../../types/model.types";

export function createUserUserCFRecommendFn(
  metaData: UserUserCFMetaData,
  loading: EventEmitter<boolean>,
  resultsChange: EventEmitter<string[]>,
  numRecommendations: number,
  medium: string
): RecommendFn {
  return async () => {
    if (!metaData?.ratings) {
      resultsChange.emit([]);
      return;
    }

    loading.emit(true);
    try {
      const results = await fetchUserUserCFRecommendations(
        metaData.ratings(), 
        numRecommendations,
        metaData.numSimilarUsers,
        metaData.embeddingMethod,
        medium
      );

      resultsChange.emit(results ?? []);
    } finally {
      loading.emit(false);
    }
  }
}