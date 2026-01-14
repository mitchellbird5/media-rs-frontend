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
  imports: [
    LucideAngularModule,
    SearchBar,
    PopupDirective,
    RatingSummary,
    SliderComponent,
    RatingPopup
  ],
  templateUrl: './user-user-cf-inputs.html',
  styleUrl: './user-user-cf-inputs.css',
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

  constructor(private route: ActivatedRoute) {}

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info

  @ViewChild('ratingPopupTrigger', { read: PopupDirective })
  ratingPopupTrigger!: PopupDirective;

  @ViewChild('ratingSummaryPopupTrigger', { read: PopupDirective })
  ratingSummaryPopupTrigger!: PopupDirective;

  @ViewChild(AutocompleteComponent)
  searchAutocomplete!: AutocompleteComponent;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  onItemSelected(item: string) {
    this.selectedItem.set(item);
    this.searchAutocomplete?.closeDropdown();

    queueMicrotask(() => {
      this.ratingPopupTrigger.open({
        name: this.selectedItem
      });
    });
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
    this.searchAutocomplete?.closeDropdown();
  };

  get showAddRatingPopup(): boolean {
    return !!this.selectedItem;
  }

  onNumSimilarUsersUpdate(users: number) {
    this.numSimilarUsers.set(users);
    this.numSimilarUsersChange.emit(users);
  }

  addRating(name: string | null, score: number) {
    if (!name) return;
    this.ratings.update(r => [...r, { name, value: score }]);
    this.ratingsChange.emit(this.ratings());
  }

  onRatingInput(value: number) {
    if (this.selectedItem() && !isNaN(value)) {
      this.addRating(this.selectedItem(), value); 
      this.selectedItem.set(''); 
    }
  }

}
