import { 
  Component, 
  Input, 
  signal,
  WritableSignal,
  Output,
  EventEmitter, 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Loader 
} from 'lucide-angular';
import { RouterModule } from '@angular/router';

import { SliderComponent } from '../../slider/slider';

@Component({
  selector: 'app-search-parameters',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    RouterModule,
    SliderComponent,
    CommonModule
  ],
  templateUrl: './search-parameters.html',
  styleUrl: './search-parameters.css',
})
export class SearchParameters {
  @Input() onRecommend!: () => void;
  @Input() width: string = '400px'
  @Input() medium!: string;
  @Input() recommendationsReady!: WritableSignal<boolean>; 
  @Input() recommendFn: () => Promise<void> = async () => {};

  numRecommendations: WritableSignal<number> = signal(10);

  @Output() numRecommendationsChange = new EventEmitter<number>();
  @Output() recommend = new EventEmitter<void>();

  readonly Loader = Loader;

  onNumRecommendationsChange(value: number) {
    this.numRecommendations.set(value);
    this.numRecommendationsChange.emit(value);
  }
}
