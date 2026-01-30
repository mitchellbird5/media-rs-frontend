import { 
  Component, 
  Input, 
  effect, 
  signal, 
  Output,
  EventEmitter
} from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";

import { DetailPopup } from "../detail-popup/detail-popup";
import { PopupDirective } from "../../popup-card/popup-directive/popup-directive";

import { fetchMovieData, MovieData } from "../../../services/movieSearch";

@Component({
  selector: "app-result-comparison",
  standalone: true,
  imports: [
    CommonModule, 
    NgIf,
    PopupDirective
  ],
  templateUrl: "./result-comparison.html",
  styleUrls: [
    "./result-comparison.css",
    "../../../styles/model.css"
  ],
})
export class ResultComparison {
  readonly resultsSignal = signal<string[]>([]);
  readonly moviesSignal = signal<MovieData[]>([]);
  
  readonly ready = signal(false);
  readonly DetailPopup = DetailPopup;

  @Output() rendered = new EventEmitter<boolean>();

  @Input({ required: true })
  set results(value: string[]) {
    this.ready.set(false);
    this.resultsSignal.set(value ?? []);
  }
  @Input() title!: string;

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
}
