import { WritableSignal } from "@angular/core";

import { fetchMediumData } from "../../services/databaseSearch";
import { MovieData, BookData } from "../../types/medium.type";

async function getMovieData(
  titles: string[],
  setReady: (ready: boolean) => void,
  mediaSignal: WritableSignal<MovieData[]>,
): Promise<void> {
    try {
      setReady(false);

      // Fetch movie data for all titles
      const allData: MovieData[] = await fetchMediumData(titles, "movies");

      // Keep the same order as requested titles
      const orderedData = titles.map(
        title => allData.find(movie => movie.title && title.startsWith(movie.title)) ?? {
          title,
          tmdb_id: undefined,
          imdb_id: undefined,
          poster_path: null,
          backdrop_path: null,
          genres: {},
          overview: null,
          runtime: null,
          popularity: null,
          release_date: null,
          tagline: null,
          vote_average: null,
        } as MovieData
      );

      mediaSignal.set(orderedData);
      setReady(true);
    } catch (err) {
      mediaSignal.set(titles.map(title => ({
        title,
        tmdb_id: undefined,
        imdb_id: undefined,
        poster_path: null,
        backdrop_path: null,
        genres: {},
        overview: null,
        runtime: null,
        popularity: null,
        release_date: null,
        tagline: null,
        vote_average: null,
      })));
      setReady(true);
    }
}

async function getBookData(
  titles: string[],
  setReady: (ready: boolean) => void,
  mediaSignal: WritableSignal<BookData[]>,
): Promise<void> {
    try {
      setReady(false);

      // Fetch book data for all titles
      const allData: BookData[] = await fetchMediumData(titles, "books");

      // Keep the same order as requested titles
      const orderedData = titles.map(
        title => allData.find(book => book.title && title.startsWith(book.title)) ?? {
          title,
          itemId: undefined,
          authors: undefined,
          lang: undefined,
          url: undefined,
          img: undefined,
          year: undefined,
          description: undefined,
        } as BookData
      );

      mediaSignal.set(orderedData);
      setReady(true);
    } catch (err) {
      mediaSignal.set(titles.map(title => ({
        title,
        itemId: undefined,
        authors: undefined,
        lang: undefined,
        url: undefined,
        img: undefined,
        year: undefined,
        description: undefined,
      })));
      setReady(true);
    }
}

export function loadMediumData(
  titles: string[],
  medium: string,
  setReady: (ready: boolean) => void,
  mediaSignal: WritableSignal<MovieData[] | BookData[]>,
): Promise<void> {
  if (medium === "movies") {
    return getMovieData(titles, setReady, mediaSignal);
  } else if (medium === "books") {
    return getBookData(titles, setReady, mediaSignal);
  } else {
    throw new Error(`Unsupported medium type: ${medium}`);
  }
}