import { 
  Component, 
  Input, 
  effect, 
  signal, 
  WritableSignal,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";

import { MovieResultCard } from "./result-card/movie-result-card/movie-result-card";
import { BookResultCard } from "./result-card/book-result-card/book-result-card";

import { MovieData, BookData } from "../../types/medium.type";
import { loadMediumData } from "./get-medium-data";

@Component({
  selector: "app-results",
  standalone: true,
  imports: [
    CommonModule, 
    MovieResultCard, 
    BookResultCard,
    NgIf
  ],
  templateUrl: "./results.html",
  styleUrls: ["./results.css"],
})
export class Results {
  readonly resultsSignal: WritableSignal<string[]> = signal<string[]>([]);
  readonly mediaSignal: WritableSignal<MovieData[] | BookData[]> = signal<MovieData[] | BookData[]>([]);
  
  readonly ready = signal(false);

  @Output() rendered = new EventEmitter<boolean>();

  @ViewChildren(MovieResultCard) resultCards!: QueryList<MovieResultCard>;

  @Input() medium!: string;
  @Input({ required: true })
  set results(value: string[]) {
    this.ready.set(false);
    this.resultsSignal.set(value ?? []);
  }

  constructor() {
    effect(() => {
      const results = this.resultsSignal();
      if (!results.length) {
        this.mediaSignal.set([]);
        this.setReady(false);
        return;
      }
      loadMediumData(
        results, 
        this.medium, 
        this.setReady.bind(this), 
        this.mediaSignal
      );
    });
  }

  setReady(value: boolean) {
    this.ready.set(value);
    this.rendered.emit(value);
  }
}