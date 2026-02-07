import { 
  Component, 
  Input, 
  effect, 
  signal, 
  WritableSignal,
  Output,
  EventEmitter
} from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";

import { MovieDetailPopup } from "../detail-popup/movie-detail-popup/movie-detail-popup";
import { BookDetailPopup } from "../detail-popup/book-detail-popup/book-detail-popup";
import { PopupDirective } from "../../popup-card/popup-directive/popup-directive";

import { MovieData, BookData } from "../../../types/medium.type";
import { loadMediumData } from "../get-medium-data";

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
  readonly resultsSignal: WritableSignal<string[]> = signal<string[]>([]);
  readonly mediaSignal: WritableSignal<MovieData[] | BookData[]> = signal<MovieData[] | BookData[]>([]);
  
  readonly ready = signal(false);
  readonly MovieDetailPopup = MovieDetailPopup;
  readonly BookDetailPopup = BookDetailPopup;

  @Output() rendered = new EventEmitter<boolean>();

  @Input() medium!: string;
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
