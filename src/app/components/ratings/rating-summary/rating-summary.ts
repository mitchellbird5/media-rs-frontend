import { 
  Component, 
  Input,
  EventEmitter,
  signal,
  WritableSignal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Trash2,
} from 'lucide-angular';

import { Rating } from '../../../types/model.types';
import { SearchBar } from '../../search-bar/search-bar';
import { SliderComponent } from '../../slider/slider';

@Component({
  selector: 'app-rating-summary',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SearchBar,
    SliderComponent
  ],
  templateUrl: './rating-summary.html',
  styleUrl: './rating-summary.css',
})
export class RatingSummary {
  @Input() ratings!: WritableSignal<Rating[]>;
  @Input() ratingsChange!: (ratings: Rating[]) => void;
  @Input() medium!: string;
  @Input() placeholder: string = 'Search...';
  @Input() autocompleteSearch!: (query: string) => Promise<string[]>;
  @Input() popupSearch!: (query: string) => Promise<string[]>;
  @Input() onItemSelected!: (item: string) => void;
  @Input() autocompleteZIndex: number = 1005;
  @Input() searchResultPopupZIndex: number = 1010;

  query: WritableSignal<string> = signal('');
  closeAutocompleteTrigger: WritableSignal<number> = signal(0);

  readonly Trash2=Trash2

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }

  updateRating(name: string, value: number) {
    this.ratings.update(r => r.map(r => r.name === name ? { ...r, value } : r));
    this.emitRatingsChange();
  }

  removeRating(name: string) {
    this.ratings.update(r => r.filter(r => r.name !== name));
    this.emitRatingsChange();
  }

  private emitRatingsChange() {
    if (typeof this.ratingsChange === 'function') {
      this.ratingsChange(this.ratings());
    }
  }

  clearSearch() {
    this.query.set('');
    this.closeAutocompleteTrigger.update(n => n + 1);
  }

  handleItemSelected(item: string) {
    queueMicrotask(() => this.onItemSelected?.(item));
    this.clearSearch();
  }
    
}