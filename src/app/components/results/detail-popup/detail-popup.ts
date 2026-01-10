import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieData } from '../../../services/movieSearch';

@Component({
  selector: 'app-detail-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-popup.html',
  styleUrls: ['./detail-popup.css'],
})
export class DetailPopup {
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