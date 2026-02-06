import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieData } from '../../../../types/medium.type';

@Component({
  selector: 'app-movie-detail-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail-popup.html',
  styleUrls: [
    '../../../../styles/detail-popup.css'
  ],
})
export class MovieDetailPopup {
  @Input() movie!: MovieData;

  @ViewChild('popupTemplate', { static: true })
  template!: TemplateRef<any>;

  /** Convert genres object to a comma-separated string */
  get genresDisplay(): string {
    return this.movie?.genres ? Object.values(this.movie.genres).join(', ') : '';
  }

  /** Format runtime */
  get runtimeDisplay(): string {
    return this.movie?.runtime ? `${this.movie.runtime} min` : '';
  }
}