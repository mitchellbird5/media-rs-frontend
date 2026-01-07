import { Component, Input } from '@angular/core';
import { Movie } from '../../../types/movies.types';

@Component({
  selector: 'app-result-card',
  imports: [],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
  @Input() result!: string;
}
