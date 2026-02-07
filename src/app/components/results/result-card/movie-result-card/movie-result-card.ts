import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieDetailPopup } from '../../detail-popup/movie-detail-popup/movie-detail-popup';
import { PopupDirective } from '../../../popup-card/popup-directive/popup-directive';

import { MovieData } from '../../../../types/medium.type';

@Component({
  selector: 'app-movie-result-card',
  standalone: true,
  imports: [CommonModule, PopupDirective],
  templateUrl: './movie-result-card.html',
  styleUrls: [
    '../../../../styles/result-card.css'
  ],
})
export class MovieResultCard {
  @Input() movie!: MovieData;
  @Input() animationDelay: string = '0s';

  readonly MovieDetailPopup = MovieDetailPopup;

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
