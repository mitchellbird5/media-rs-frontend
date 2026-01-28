import { EventEmitter } from '@angular/core';

import { fetchItemItemCFRecommendations } from '../../../services/recommend/get-item-item-cf-recommendation';

import { ItemItemCFMetaData } from '../../../types/model.types';
import { RecommendFn } from '../../../types/movies.types';

export function createItemItemCFRecommendFn(
  metaData: ItemItemCFMetaData,
  loading: EventEmitter<boolean>,
  resultsChange: EventEmitter<string[]>,
  numRecommendations: number
): RecommendFn {
  return async () => {
    if (!metaData?.selectedItem) {
      resultsChange.emit([]);
      return;
    }

    loading.emit(true);

    const results = await fetchItemItemCFRecommendations(
      metaData.selectedItem, 
      numRecommendations
    );
    resultsChange.emit(results ?? []);

    loading.emit(false);
    
  };
}