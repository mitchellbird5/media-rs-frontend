import { 
  Component, 
  Input, 
  Output,
  ViewChild, 
  signal,
  EventEmitter,
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

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Results } from '../../results/results';
import { Rating, fetchUserUserCFRecommendations } from '../../../services/recommend/get-user-user-cf-recommendation'; 
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';
import { RatingPopup } from '../../rating-popup/rating-popup';
import { RatingSummary } from '../../rating-summary/rating-summary';
import { SliderComponent } from '../../slider/slider';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-user-user-cf',
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
    RatingSummary,
    SliderComponent
  ],
  templateUrl: './user-user-cf.html',
  styleUrl: './user-user-cf.css',
})
export class UserUserCF {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();
  @Output() numSimilarUsersChange = new EventEmitter<number>();
  @Output() ratingsChange = new EventEmitter<Rating[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.recommendFnReady.emit(this.recommend);
  }

  searchQuery: WritableSignal<string> = signal('');
  selectedItem: string | null = null;
  ratingInput: string = '';
  numSimilarUsers: WritableSignal<number> = signal(25);

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
    `Recommend items that other users with similar likes rated highly.`;

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

  onNumSimilarUsersChange(value: number) {
    this.numSimilarUsers.set(value);
    this.numSimilarUsersChange.emit(value);
  }


  onResultsRendered(ready: boolean) {
    this.recommendationsReady.set(ready);
  }

  addRating(name: string, score: number) {
    this.ratings.update(r => [...r, { name, value: score }]);
    this.ratingsChange.emit(this.ratings());
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

  private recommend: RecommendFn = async () => {
    const results = await fetchUserUserCFRecommendations(
      this.ratings(), 
      this.numRecommendations,
      this.numSimilarUsers()
    );

    this.resultsReady.emit(results ?? []);
  }

}
