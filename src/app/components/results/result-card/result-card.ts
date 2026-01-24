import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieData } from '../../../services/movieSearch';
import { DetailPopup } from '../detail-popup/detail-popup';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule, PopupDirective],
  templateUrl: './result-card.html',
  styleUrls: ['./result-card.css'],
})
export class ResultCard implements OnChanges {
  @Input() movie!: MovieData;
  @Input() animationDelay: string = '0s';

  readonly DetailPopup = DetailPopup;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movie']) {
      console.log('Movie data changed:', this.movie);
    }
  }

  get genresDisplay(): string {
    return this.movie?.genres ? Object.values(this.movie.genres).join(', ') : '';
  }

  get runtimeDisplay(): string {
    return this.movie?.runtime ? `${this.movie.runtime} min` : '';
  }

  get titleDisplay(): string {
    return this.movie?.title ? this.movie.title.replace(/\s*\(\d{4}\)$/, "") : '';
  }

  getFullImageUrl(file_path?: string | null) {
    return file_path ? `https://image.tmdb.org/t/p/w500${file_path}` : '';
  }
}
