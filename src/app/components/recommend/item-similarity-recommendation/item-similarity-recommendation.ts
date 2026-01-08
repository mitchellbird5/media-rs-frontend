import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info, Search } from 'lucide-angular';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Movie } from '../../../types/movies.types';
import { Results } from '../../results/results';
import { fetchItemSimilarityRecommendations } from '../../../services/recommend/get-item-similarity-recommendation';
import { fetchMovieTitles } from '../../../services/movieSearch';
import { AutocompleteComponent } from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-item-similarity-recommendation',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    NgIf,
    Results,
    AutocompleteComponent
  ],
  templateUrl: './item-similarity-recommendation.html',
  styleUrl: './item-similarity-recommendation.css',
})
export class ItemSimilarityRecommendation {
  @Input() medium!: string;

  showInfo: boolean = false;
  numRecommendations!: number;
  movies!: string[] | null;
  selectedMovie!: string;
  readonly Info = Info;
  loadingRecommendations: boolean = false;
  

  info_title: string = 'Item Similarity Recommendation'
  info_description: string = 'Recommend movies that are similar to the selected movie based on similarity of title, genre and tags using sentence transform (all-MiniLM-L6-v2) aka SBERT.'

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  async onRecommend(title: string) {
    this.loadingRecommendations = true;
    this.movies = await fetchItemSimilarityRecommendations(title, 10)
    this.loadingRecommendations = false;
  }

  onMovieSelected(movie: string) {
    this.selectedMovie = movie;
    console.log('Selected movie:', movie);
  }
}
