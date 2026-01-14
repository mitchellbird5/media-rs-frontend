import { 
  Component,
  signal,
  WritableSignal,
  Input,
  Output,
  ViewChild,
  EventEmitter 
} from '@angular/core';
import { 
  LucideAngularModule, 
  Search, 
} from 'lucide-angular';

import { AutocompleteComponent } from '../autocomplete/autocomplete';
import { PopupDirective } from '../popup-card/popup-directive/popup-directive';
import { SearchResults } from '../search-results/search-results';

@Component({
  selector: 'app-search-bar',
  imports: [
    AutocompleteComponent,
    LucideAngularModule,
    PopupDirective,
    SearchResults
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {
  loadingSearchResults: WritableSignal<boolean> = signal(false)
  searchResults: WritableSignal<string[]> = signal<string[]>([]);

  @Input() searchQuery!: WritableSignal<string>;
  @Input() search!: (query: string) => Promise<string[]>;
  @Input() width: string = '400px';
  @Input() placeholder: string = 'Search...';
  @Input() popupTitle: string = 'Searching...'
  @Input() autocompleteZIndex: number = 1000;
  @Input() searchResultPopupZIndex: number = 1005;
  @Input() autocompleteForceCloseSignal?: WritableSignal<number>;

  readonly Search = Search;

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() selectedItemChange = new EventEmitter<string>();

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(SearchResults) searchResultsComponent!: SearchResults;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  async onSearchIconClick() {
    if (!this.searchQuery) return;
    this.loadingSearchResults.set(true);
    try {
      const results = await this.search(this.searchQuery())
      this.searchResults.set(results);
    } finally {
      this.loadingSearchResults.set(false);
    }
  }

  onSelected(item: string) {
    if (!item) return;
    this.selectedItemChange.emit(item);
  }

  selectAutocomplete(item: string) {
    this.loadingSearchResults.set(true);
    this.onSelected(item);
    this.autocomplete.closeDropdown();
    this.searchResults.set([]);
  }
}
