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
  @Output() cleared = new EventEmitter<void>();

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  async onSearchIconClick() {
    this.autocomplete.closeDropdown();
    if (!this.searchQuery) return;

    this.loadingSearchResults.set(true);

    this.searchResultsPopup?.popupContext.refresh?.();

    const results = await this.search(this.searchQuery());

    queueMicrotask(() => {
      this.searchResults.set(results);
      this.loadingSearchResults.set(false);
      this.searchResultsPopup?.popupContext.refresh?.();
    });
  }

  onSelected(item: string) {
    this.searchQuery.set('')
    this.selectedItemChange.emit(item);
    this.searchResults.set([]);
  }

  onCleared() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.searchResultsPopup?.close?.();
    this.cleared.emit();
  }
}
