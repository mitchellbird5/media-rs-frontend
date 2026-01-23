import { 
  Component, 
  Input,
  ViewChild,
  TemplateRef,
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

import { Rating } from '../../services/recommend/get-user-user-cf-recommendation';
import { SearchBar } from '../search-bar/search-bar';
import { SliderComponent } from '../slider/slider';

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
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() placeholder: string = 'Search...';
  @Input() search!: (query: string) => Promise<string[]>;
  @Input() onItemSelected!: (item: string) => void;

  query: WritableSignal<string> = signal('');
  searchResults: WritableSignal<string[]> = signal([]);
  closeAutocompleteTrigger: WritableSignal<number> = signal(0);

  readonly Trash2=Trash2

  @ViewChild('ratingSummaryPopup', { static: true })
  template!: TemplateRef<any>;

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }

  updateRating(
    ratingsSignal: WritableSignal<Rating[]>, 
    ratingsChange: EventEmitter<Rating[]>, 
    name: string, 
    value: number
  ) {
    ratingsSignal.update(r => r.map(r => r.name === name ? { ...r, value } : r));
    ratingsChange.emit(ratingsSignal());
  }

  removeRating(
    ratingsSignal: WritableSignal<Rating[]>, 
    ratingsChange: EventEmitter<Rating[]>, 
    name: string, 
  ) {
    ratingsSignal.update(r => r.filter(rating => rating.name !== name));
    ratingsChange.emit(ratingsSignal());
  }

  clearSearch() {
    this.query.set('');
    this.closeAutocompleteTrigger.set(this.closeAutocompleteTrigger() + 1);
  }
  
}
