export interface Movie {
  title: string;
  imdbId: string;
  tmdbId: string;
  genre: string[];
  tags: string[];
}

export type RecommendFn = () => Promise<void>;