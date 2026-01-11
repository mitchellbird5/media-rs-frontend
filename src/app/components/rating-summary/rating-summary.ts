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
import { AutocompleteComponent } from '../autocomplete/autocomplete';
import { SearchResults } from '../search-results/search-results';
import { PopupDirective } from '../popup-card/popup-directive/popup-directive';

@Component({
  selector: 'app-rating-summary',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    AutocompleteComponent,
    SearchResults,
    PopupDirective
  ],
  templateUrl: './rating-summary.html',
  styleUrl: './rating-summary.css',
})
export class RatingSummary {
  @Input() ratings: Rating[] = [];
  @Input() medium!: string;
  @Input() search!: (query: string) => Promise<string[]>;
  @Input() onItemSelected!: (item: string) => void;
  @Input() onSearchClick!: () => void;
  @Input() onSearchSelect!: (item: string) => void;
  @Input() loadingSearchResults!: Signal<boolean>;
  @Input() searchResults!: Signal<string[]>;

  searchQuery: WritableSignal<string> = signal('');

  readonly Search = Search;

  @ViewChild('ratingSummaryPopup', { static: true })
  template!: TemplateRef<any>;

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }
}
