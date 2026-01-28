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
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {
  loadingSearchResults: WritableSignal<boolean> = signal(false)
  searchResults: WritableSignal<string[]> = signal<string[]>([]);

  _searchQuery: WritableSignal<string> = signal('');

  @Input() autocompleteSearch!: (query: string) => Promise<string[]>;
  @Input() popupSearch!: (query: string) => Promise<string[]>;
  @Input() width: string = '400px';
  @Input() placeholder: string = 'Search...';
  @Input() popupTitle: string = 'Searching...'
  @Input() autocompleteZIndex: number = 1000;
  @Input() searchResultPopupZIndex: number = 1005;
  @Input() autocompleteForceCloseSignal?: WritableSignal<number>;

  readonly Search = Search;
  readonly SearchResults = SearchResults;

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() selectedItemChange = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  onQueryChange(query: string) {
    this._searchQuery.set(query);
    this.searchQueryChange.emit(query);
  }

  async onSearchIconClick() {
    this.autocomplete.closeDropdown();
    const currentQuery = this._searchQuery();

    if (!currentQuery) return;

    this.loadingSearchResults.set(true);
    this.searchResultsPopup?.popupContext.refresh?.();

    const results = await this.popupSearch(currentQuery);

    queueMicrotask(() => {
      this.searchResults.set(results);
      this.loadingSearchResults.set(false);
      this.searchResultsPopup?.popupContext.refresh?.();
    });
  }

  onSelected(item: string) {
    this._searchQuery.set('')
    this.selectedItemChange.emit(item);
    this.searchResults.set([]);
    this.searchResultsPopup?.close?.();
  }

  onCleared() {
    this._searchQuery.set('');
    this.searchResults.set([]);
    this.searchResultsPopup?.close?.();
    this.cleared.emit();
  }
}
