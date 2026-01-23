import { RecommendFn } from "./movies.types";

export type EmbeddingMethod = 'SBERT' | 'TFIDF';

export interface ModelParameters {
  show: boolean,
  results: string[],
  loading: boolean,
  recommendFn: RecommendFn | null,
  recommendationsReady: boolean
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

export function isModelType(value: string): value is ModelType {
  return Object.values(ModelType).includes(value as ModelType);
}