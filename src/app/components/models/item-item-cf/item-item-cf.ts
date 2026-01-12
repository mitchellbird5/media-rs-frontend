import { 
  Component, 
  Input, 
  ViewChild, 
  signal,
  Output,
  EventEmitter 
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
import { ActivatedRoute, RouterModule  } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Results } from '../../results/results';
import { fetchItemItemCFRecommendations } from '../../../services/recommend/get-item-item-cf-recommendation';
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-item-item-cf',
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
    RouterModule
  ],
  templateUrl: './item-item-cf.html',
  styleUrl: './item-item-cf.css',
})
export class ItemItemCF {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  selectedItem: string | null = null;
  searchQuery = signal('');

  @Output() selectedItemChange = new EventEmitter<string | null>();
  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.medium = this.route.snapshot.paramMap.get('medium')!;
    this.recommendFnReady.emit(this.recommend);
  }

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info;
  readonly Search = Search;
  readonly Trash2 = Trash2;

  info_title = 'Item-Item Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that are commonly rated high by users who also enjoyed this particular item.`;

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(SearchResults) searchResultsComponent!: SearchResults;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  onItemSelected(item: string) {
    this.selectedItem = item;
    this.selectedItemChange.emit(item);
  }

  clearSelectedItem() {
    this.selectedItem = null;
    this.searchQuery.set('');
    this.selectedItemChange.emit(null);
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

  if (!this.selectedItem) return;

  const results =
    await fetchItemItemCFRecommendations(
      this.selectedItem,
      this.numRecommendations
    );

  this.resultsReady.emit(results ?? []);

  }
}
