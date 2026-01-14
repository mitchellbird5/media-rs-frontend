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
  @Input() ratings!: Rating[];
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() placeholder: string = 'Search...';
  @Input() search!: (query: string) => Promise<string[]>;
  @Input() onItemSelected!: (item: string) => void;

  query: WritableSignal<string> = signal('');
  searchResults: WritableSignal<string[]> = signal([]);

  @Output() queryChange = new EventEmitter<string>();

  private onItemSelectedFn?: (item: string) => void;
  closeAutocompleteTrigger = signal(0);

  readonly Search = Search;

  @ViewChild('ratingSummaryPopup', { static: true })
  template!: TemplateRef<any>;

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }

  handleSelect = (item: string) => {
    this.onItemSelected(item);
    this.closeAutocompleteTrigger.update(v => v + 1);
    this.onItemSelectedFn?.(item);
    this.query.set('');
  };

  registerOnItemSelected(fn: (item: string) => void) {
    this.onItemSelectedFn = fn;
  }
  
}
