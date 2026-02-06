
export enum MediumType {
  Movies = 'movies',
  Books = 'books',
  Music = 'music'
}

export function isMediumType(value: string): value is MediumType {
  return Object.values(MediumType).includes(value as MediumType);
}

export interface MovieData {
  title: string;
  tmdb_id?: number;
  imdb_id?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genres?: Record<number, string>;
  overview?: string | null;
  runtime?: number | null;
  popularity?: number | null;
  release_date?: string | null;
  tagline?: string | null;
  vote_average?: number | null;
}

export interface BookData {
  title: string;
  itemId?: number;
  authors?: string;
  lang?: string;
  url?: string;
  img?: string;
  year?: number;
  description?: string;
}

export interface MovieDataSimple {
  title: string;
  itemId: number;
}