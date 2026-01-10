import { 
  Component, 
  Input, 
  ViewChild, 
  signal 
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
import { 
  fetchItemSimilarityRecommendations,
  fetchItemSimilarityDescriptionRecommendations 
} from '../../../services/recommend/get-item-similarity-recommendation';
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';

@Component({
  selector: 'app-item-similarity-recommendation',
  standalone: true,
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
    RouterModule
  ],
  templateUrl: './item-similarity-recommendation.html',
  styleUrl: './item-similarity-recommendation.css',
})
export class ItemSimilarityRecommendation {
  medium!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.medium = this.route.snapshot.paramMap.get('medium')!;
  }

  searchQuery: string = '';
  selectedItem!: string;
  numRecommendations: number = 10;

  loadingRecommendations = signal(false);
  recommendationsReady = signal(true);  // initially true for the sake of spinner logic
  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);
  items = signal<string[]>([]);

  readonly Info = Info;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly Loader = Loader;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items based on similarity of content using sentence transform (all-MiniLM-L6-v2) aka SBERT.`;

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(SearchResults) searchResultsComponent!: SearchResults;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  async onRecommend() {
    this.loadingRecommendations.set(true);

    // Declare variables in the outer scope
    let query: string; // use proper type if needed
    let method: (query: string, num: number) => Promise<string[] | null>; // type your function properly

    if (!this.selectedItem) {
      query = this.searchQuery;
      method = fetchItemSimilarityDescriptionRecommendations;
    } else {
      query = this.selectedItem;
      method = fetchItemSimilarityRecommendations;
    }

    try {
      const recommendedItems = await method(query, this.numRecommendations);
      this.items.set(recommendedItems ?? []);
    } finally {
      this.loadingRecommendations.set(false);
    }
  }

  onItemSelected(item: string) {
    this.selectedItem = item;
  }

  clearSelectedItem() {
    this.selectedItem = '';
    this.items.set([]);
    this.searchResults.set([]);
  }

  async onSearchClick() {
    if (!this.searchQuery) return;

    this.autocomplete?.closeDropdown();

    this.loadingSearchResults.set(true);
    this.searchResults.set([]);

    try {
      const results = await fetchMovieTitles(this.searchQuery, 50);
      this.searchResults.set(results);
    } finally {
      this.loadingSearchResults.set(false);
    }
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery = '';
  };

  onNumRecommendationsChange(value: number) {
    this.numRecommendations = value;
  }

  onResultsRendered(ready: boolean) {
    this.recommendationsReady.set(ready);
  }
}
