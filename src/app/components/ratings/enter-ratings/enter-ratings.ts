import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  ViewChild, 
  EventEmitter
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchBar } from '../../search-bar/search-bar';
import { RatingSummary } from '../rating-summary/rating-summary';
import { RatingPopup } from '../rating-popup/rating-popup';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';

import { fetchMediaTitles } from '../../../services/databaseSearch';

import { Rating } from '../../../types/model.types';

@Component({
  selector: 'app-enter-ratings',
  imports: [
    SearchBar,
    PopupDirective
  ],
  templateUrl: './enter-ratings.html',
  styleUrls: [
    './enter-ratings.css',
    '../../../styles/model.css',
    '../../../styles/button.css'
  ],
})
export class EnterRatings {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex: number = 1050;
  @Input() ratingSummaryZIndex: number = 1050;
  @Input() ratings!: WritableSignal<Rating[]>;

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');

  @Output() ratingsChange = new EventEmitter<Rating[]>();

  readonly RatingSummary = RatingSummary;
  readonly RatingPopup = RatingPopup;

  private ratingPopupOpenFor: string | null = null;

  constructor(private route: ActivatedRoute) {}

  @ViewChild('ratingPopupTrigger', { read: PopupDirective })
  ratingPopupTrigger!: PopupDirective;

  @ViewChild('ratingSummaryPopupTrigger', { read: PopupDirective })
  ratingSummaryPopupTrigger!: PopupDirective;

  @ViewChild(AutocompleteComponent)
  searchAutocomplete!: AutocompleteComponent;

  autocompleteSearch = async (query: string): Promise<string[]> => {
    return await fetchMediaTitles(query, this.medium, 5);
  };

  popupSearch = async (query: string): Promise<string[]> => {
    return await fetchMediaTitles(query, this.medium, 50);
  };

  onItemSelected(item: string) {
    this.processRatingPopup(item);
  }

  private processRatingPopup(item: string) {
    this.ratingPopupOpenFor = item;
    this.selectedItem.set(item);
    this.searchAutocomplete?.closeDropdown();

    this.ratingPopupTrigger?.open({
      name: item,
      onRatingInput: this.onRatingInput
    });
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
    this.searchAutocomplete?.closeDropdown();
  };

  addRating(name: string | null, score: number) {
    if (!name) return;

    const existingIndex = this.ratings().findIndex(r => r.name === name);
        if (existingIndex !== -1) {
      return;
    }
    
    this.ratings.update(r => [...r, { name, value: score }]);
    this.ratingsChange.emit(this.ratings());
  }

  handleRatingsChange = (newRatings: Rating[]) => {
    this.ratings.set(newRatings);
    this.ratingsChange.emit(newRatings);
  };

  onRatingInput = (value: number) => {

    const name = this.selectedItem();
    if (name != null && !isNaN(value)) {
      this.selectedItem.set(null);
      this.ratingPopupOpenFor = null;

      this.addRating(name, value);

      this.ratingPopupTrigger?.close();
    }
  };

  
}
