import { RecommendFn } from "./movies.types";

export type EmbeddingMethod = 'SBERT' | 'TFIDF';

export interface ModelParameters {
  show: boolean,
  results: string[],
  loading: boolean,
  recommendFn: RecommendFn | null,
  recommendationsReady: boolean,
  metaData: ModelMetaData
}

export interface Rating {
  name: string;
  value: number;
}

export enum ModelType {
  ItemSimilarity = 'item-similarity',
  ItemItemCF = 'item-item-cf',
  UserUserCF = 'user-user-cf',
  Hybrid = 'hybrid'
}

export const ModelTitles: Record<ModelType, string> = {
  [ModelType.ItemSimilarity]: 'Item Similarity',
  [ModelType.ItemItemCF]: 'Item–Item Collaborative Filtering',
  [ModelType.UserUserCF]: 'User–User Collaborative Filtering',
  [ModelType.Hybrid]: 'Hybrid',
};

export const nullMetaData: ModelMetaDataMap = {
  [ModelType.ItemSimilarity]: {
    selectedItem: null,
    query: '',
    embeddingMethod: 'SBERT'
  },
  [ModelType.ItemItemCF]: {
    selectedItem: null
  },
  [ModelType.UserUserCF]: {
    ratings: [],
    numSimilarUsers: 25,
    embeddingMethod: 'SBERT'
  },
  [ModelType.Hybrid]: {
    selectedItem: null,
    ratings: [],
    embeddingMethod: 'SBERT'
  }
};

export type ModelMetaDataMap = {
  [ModelType.ItemSimilarity]: ItemSimilarityMetaData;
  [ModelType.ItemItemCF]: ItemItemCFMetaData;
  [ModelType.UserUserCF]: UserUserCFMetaData;
  [ModelType.Hybrid]: HybridMetaData;
};


export function isModelType(value: string): value is ModelType {
  return Object.values(ModelType).includes(value as ModelType);
}

export interface ItemSimilarityMetaData {
  selectedItem: string | null;
  query: string;
  embeddingMethod: EmbeddingMethod;
}

export interface ItemItemCFMetaData {
  selectedItem: string | null;
}

export interface UserUserCFMetaData {
  ratings: Rating[];
  numSimilarUsers: number;
  embeddingMethod: EmbeddingMethod;
}

export interface HybridMetaData {
  selectedItem: string | null;
  ratings: Rating[];
  embeddingMethod: EmbeddingMethod;
}

export type ModelMetaData = ItemSimilarityMetaData | ItemItemCFMetaData | UserUserCFMetaData | HybridMetaData;