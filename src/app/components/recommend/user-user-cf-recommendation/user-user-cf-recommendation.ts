import { 
  Component, 
  Input, 
  ViewChild, 
  signal,
  TemplateRef,
  WritableSignal 
} from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Info, 
  Search, 
  Trash2,
  Loader 
} from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { TextInput } from '../../text-input/text-input';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Results } from '../../results/results';
import { Rating, fetchUserUserCFRecommendations } from '../../../services/recommend/get-user-user-cf-recommendation'; 
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';
import { RatingPopup } from '../../rating-popup/rating-popup';
import { RatingSummary } from '../../rating-summary/rating-summary';

@Component({
  selector: 'app-user-user-cf-recommendation',
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    NgIf,
    Results,
    AutocompleteComponent,
    CommonModule,
    ModelInfo,
    SearchResults,
    RouterModule,
    RatingPopup,
    RatingSummary
  ],
  templateUrl: './user-user-cf-recommendation.html',
  styleUrl: './user-user-cf-recommendation.css',
})
export class UserUserCFRecommendation {
  medium!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.medium = this.route.snapshot.paramMap.get('medium')!;
  }

  searchQuery: WritableSignal<string> = signal('');
  selectedItem!: string;
  ratingInput: string = '';
  numRecommendations: number = 10;
  numSimilarUsers: number = 25;

  ratings: WritableSignal<Rating[]> = signal([]);

  loadingRecommendations = signal(false);
  recommendationsReady = signal(true);  // initially true for the sake of spinner logic

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);
  items = signal<string[]>([]);

  readonly Info = Info;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly Loader = Loader;

  info_title = 'User-User Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

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

  async onRecommend() {
    this.loadingRecommendations.set(true);

    try {
      const recommendedItems = await fetchUserUserCFRecommendations(
        this.ratings(), 
        this.numRecommendations,
        this.numSimilarUsers
      );
      this.items.set(recommendedItems ?? []);
    } finally {
      this.loadingRecommendations.set(false);
    }
  }

  onItemSelected(item: string) {
    this.selectedItem = item;
    this.searchAutocomplete?.closeDropdown();

    queueMicrotask(() => {
      this.ratingPopupTrigger.open({
        name: this.selectedItem
      });
    });
  }

  clearSelectedItem() {
    this.selectedItem = '';
    this.items.set([]);
    this.searchResults.set([]);
  }

  async onSearchClick(query: WritableSignal<string>) {
    if (!query) return;

    this.loadingSearchResults.set(true);
    this.searchResults.set([]);

    try {
      const results = await fetchMovieTitles(query(), 50);
      this.searchResults.set(results);
    } finally {
      this.loadingSearchResults.set(false);
    }
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
    this.searchAutocomplete?.closeDropdown();
  };

  onNumRecommendationsChange(value: number) {
    this.numRecommendations = value;
  }

  onResultsRendered(ready: boolean) {
    this.recommendationsReady.set(ready);
  }

  addRating(name: string, score: number) {
    this.ratings.update(r => [...r, { name, value: score }]);
  }

  onRatingInput(value: number) {
    if (this.selectedItem && !isNaN(value)) {
      this.addRating(this.selectedItem, value); 
      this.selectedItem = ''; 
    }
  }


  get showAddRatingPopup(): boolean {
    return !!this.selectedItem;
}

}
