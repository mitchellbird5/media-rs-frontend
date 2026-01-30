import { 
  Component, 
  Input, 
  effect, 
  signal, 
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";

import { ResultCard } from "./result-card/result-card";

import { fetchMovieData, MovieData } from "../../services/movieSearch";

@Component({
  selector: "app-results",
  standalone: true,
  imports: [
    CommonModule, 
    ResultCard, 
    NgIf
  ],
  templateUrl: "./results.html",
  styleUrls: ["./results.css"],
})
export class Results {
  readonly resultsSignal = signal<string[]>([]);
  readonly moviesSignal = signal<MovieData[]>([]);
  
  readonly ready = signal(false);

  @Output() rendered = new EventEmitter<boolean>();

  @ViewChildren(ResultCard) resultCards!: QueryList<ResultCard>;

  @Input({ required: true })
  set results(value: string[]) {
    this.ready.set(false);
    this.resultsSignal.set(value ?? []);
  }

  constructor() {
    // Reactively load movie data whenever titles change
    effect(() => {
      const results = this.resultsSignal();
      if (!results.length) {
        this.moviesSignal.set([]);
        this.setReady(false);
        return;
      }
      this.loadMovieData(results);
    });
  }

  /** Load full movie data from backend */
  private async loadMovieData(results: string[]) {
    try {
      this.setReady(false);

      // Fetch movie data for all titles
      const allData: MovieData[] = await fetchMovieData(results);

      // Keep the same order as requested titles
      const orderedData = results.map(
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

      this.moviesSignal.set(orderedData);
      this.setReady(true);
    } catch (err) {
      this.moviesSignal.set(results.map(title => ({
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
      this.setReady(true);
    }
  }

  /** Set ready and emit rendered event */
  private setReady(value: boolean) {
    this.ready.set(value);
    this.rendered.emit(value);
  }

  /** Helper for full image URL */
  getFullImageUrl(file_path?: string | null) {
    return file_path ? `https://image.tmdb.org/t/p/w500${file_path}` : '';
  }
}
