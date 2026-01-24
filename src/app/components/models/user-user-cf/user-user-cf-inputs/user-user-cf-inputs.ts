import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter,
  ViewChild 
} from '@angular/core';
import { 
  LucideAngularModule, 
  Info
} from 'lucide-angular';
import { ActivatedRoute  } from '@angular/router';

import { fetchMovieTitles } from '../../../../services/movieSearch';
import { SearchBar } from '../../../search-bar/search-bar';
import { Rating } from '../../../../services/recommend/get-user-user-cf-recommendation';
import { PopupDirective } from '../../../popup-card/popup-directive/popup-directive';
import { RatingSummary } from '../../../rating-summary/rating-summary';
import { SliderComponent } from '../../../slider/slider';
import { RatingPopup } from '../../../rating-popup/rating-popup';
import { AutocompleteComponent } from '../../../autocomplete/autocomplete';

@Component({
  selector: 'app-user-user-cf-inputs',
  standalone: true,
  imports: [
    LucideAngularModule,
    SearchBar,
    PopupDirective,
    SliderComponent
  ],
  templateUrl: './user-user-cf-inputs.html',
  styleUrls: [
    '../../../../styles/button.css',
    '../../../../styles/model.css'
  ], 
})
export class UserUserCFInputs {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() width: string = '400px';

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');
  ratings: WritableSignal<Rating[]> = signal([]);
  numSimilarUsers: WritableSignal<number> = signal(25);

  @Output() numSimilarUsersChange = new EventEmitter<number>();
  @Output() ratingsChange = new EventEmitter<Rating[]>();

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info;
  readonly RatingSummary = RatingSummary;
  readonly RatingPopup = RatingPopup;

  private ratingPopupQueue: string | null = null;
  private ratingPopupOpening = false;
  private ratingPopupOpenFor: string | null = null;


  @ViewChild('ratingPopupTrigger', { read: PopupDirective })
  ratingPopupTrigger!: PopupDirective;

  @ViewChild('ratingSummaryPopupTrigger', { read: PopupDirective })
  ratingSummaryPopupTrigger!: PopupDirective;

  @ViewChild(AutocompleteComponent)
  searchAutocomplete!: AutocompleteComponent;

  constructor() {}

  search = async (query: string): Promise<string[]> => {
    return await fetchMovieTitles(query, 5);
  };

  onItemSelected(item: string) {
    if (this.ratingPopupOpenFor === item) return;

    if (this.ratingPopupOpening) {
      this.ratingPopupQueue = item;
      return;
    }

    this.processRatingPopup(item);
  }

  private processRatingPopup(item: string) {
    this.ratingPopupOpening = true;
    this.ratingPopupOpenFor = item;
    this.selectedItem.set(item);
    this.searchAutocomplete?.closeDropdown();

    // defer the actual popup open to next tick
    queueMicrotask(() => {
      this.ratingPopupTrigger?.open({
        name: item,
        onRatingInput: (value: number) => this.onRatingInput(value)
      });

      this.ratingPopupOpening = false;

      // If another item was queued during opening, process it now
      if (this.ratingPopupQueue) {
        const nextItem = this.ratingPopupQueue;
        this.ratingPopupQueue = null;
        this.processRatingPopup(nextItem);
      }
    });
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
    this.searchAutocomplete?.closeDropdown();
  };

  onNumSimilarUsersUpdate(users: number) {
    this.numSimilarUsers.set(users);
    this.numSimilarUsersChange.emit(users);
  }

  addRating(name: string | null, score: number) {
    if (!name) return;

    const existingIndex = this.ratings().findIndex(r => r.name === name);
    if (existingIndex !== -1) return; // Don't add duplicates
    
    this.ratings.update(r => [...r, { name, value: score }]);
    this.ratingsChange.emit(this.ratings());
  }

  handleRatingsChange = (newRatings: Rating[]) => {
    this.ratings.set(newRatings);
    this.ratingsChange.emit(newRatings);
  };

  onRatingInput(value: number) {
    const name = this.selectedItem();
    if (name != null && !isNaN(value)) {
      this.addRating(name, value);
      
      queueMicrotask(() => {
        this.selectedItem.set(null);
        this.ratingPopupOpenFor = null;
      });
    }
  };

}
