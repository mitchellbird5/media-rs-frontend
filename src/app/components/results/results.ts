import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../types/movies.types';
import { ResultCard } from './result-card/result-card';

@Component({
  selector: 'app-results',
  imports: [
    CommonModule,
    ResultCard
  ],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  @Input() results: string[] = [];
}
