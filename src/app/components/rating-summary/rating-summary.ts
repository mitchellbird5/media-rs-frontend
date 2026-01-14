import { 
  Component, 
  Input,
  ViewChild,
  TemplateRef,
  EventEmitter,
  Output,
  signal,
  Signal,
  WritableSignal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Search,
} from 'lucide-angular';

import { Rating } from '../../services/recommend/get-user-user-cf-recommendation';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-rating-summary',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SearchBar
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

  closeAutocompleteTrigger = signal(0);

  @ViewChild('ratingSummaryPopup', { static: true })
  template!: TemplateRef<any>;

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }

  updateRating(name: string, value: number) {
    queueMicrotask(() => {
      this.ratings.update(r => r.map(r => r.name === name ? { ...r, value } : r));
    });
  }
  
}
