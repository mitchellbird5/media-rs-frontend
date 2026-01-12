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
} from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';

import { 
  fetchItemSimilarityRecommendations,
  fetchItemSimilarityDescriptionRecommendations
} from '../../../services/recommend/get-item-similarity-recommendation';
import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-item-similarity',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    NgIf,
    AutocompleteComponent,
    CommonModule,
    ModelInfo,
    SearchResults,
    RouterModule,
  ],
  templateUrl: './item-similarity.html',
  styleUrl: './item-similarity.css',
})
export class ItemSimilarity {
  @Input() medium!: string;
  @Input() model!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  selectedItem: string | null = null;
  searchQuery: WritableSignal<string> = signal('');

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.recommendFnReady.emit(this.recommend);
  }

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);
  

  readonly Info = Info;
  readonly Search = Search;
  readonly Trash2 = Trash2;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(SearchResults) searchResultsComponent!: SearchResults;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  onItemSelected(item: string) {
    this.selectedItem = item;
  }

  clearSelectedItem() {
    this.selectedItem = null;
    this.searchQuery.set('');
  }

  async onSearchClick() {
    if (!this.searchQuery) return;

    this.autocomplete?.closeDropdown();

    this.loadingSearchResults.set(true);
    this.searchResults.set([]);

    try {
      const results = await fetchMovieTitles(this.searchQuery(), 50);
      this.searchResults.set(results);
    } finally {
      this.loadingSearchResults.set(false);
    }
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
  };

  private recommend: RecommendFn = async () => {
    const query = this.selectedItem ?? this.searchQuery();

    if (!query) return;

    const method = this.selectedItem
      ? fetchItemSimilarityRecommendations
      : fetchItemSimilarityDescriptionRecommendations;

    const results = await method(query, this.numRecommendations);

    this.resultsReady.emit(results ?? []);
  };

}
