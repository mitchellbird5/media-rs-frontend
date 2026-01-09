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
  Trash2 
} from 'lucide-angular';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Movie } from '../../../types/movies.types';
import { Results } from '../../results/results';
import { fetchItemSimilarityRecommendations } from '../../../services/recommend/get-item-similarity-recommendation';
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
    SearchResults
  ],
  templateUrl: './item-similarity-recommendation.html',
  styleUrl: './item-similarity-recommendation.css',
})
export class ItemSimilarityRecommendation {
  @Input() medium!: string;

  searchQuery: string = '';
  selectedMovie!: string;
  movies!: string[] | null;
  numRecommendations: number = 10;

  loadingRecommendations = signal(false);
  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info;
  readonly Search = Search;
  readonly Trash2 = Trash2;

  info_title = 'Item Similarity Recommendation';
  info_description =
    'Recommend movies that are similar to the selected movie based on similarity of title, genre and tags using sentence transform (all-MiniLM-L6-v2) aka SBERT.';

  @ViewChild(PopupDirective) searchResultsPopup!: PopupDirective;
  @ViewChild(SearchResults) searchResultsComponent!: SearchResults;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  async onRecommend(title: string) {
    this.loadingRecommendations.set(true);
    this.movies = await fetchItemSimilarityRecommendations(title, 10);
    this.loadingRecommendations.set(false);
  }

  onMovieSelected(movie: string) {
    this.selectedMovie = movie;
  }

  clearSelectedMovie() {
    this.selectedMovie = '';
    this.movies = null;
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

  onSearchSelect = (movie: string) => {
    this.onMovieSelected(movie);
    this.searchQuery = '';
  };

  
}
