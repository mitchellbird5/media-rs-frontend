import { 
  Component,
  Input, 
  Output,
  signal,
  EventEmitter,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Info, 
} from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { ModelInfo } from '../../model-info/model-info';
import { SearchResults } from '../../search-results/search-results';
import { ItemItemCFInputs } from '../item-item-cf/item-item-cf-inputs/item-item-cf-inputs';

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
    CommonModule,
    ModelInfo,
    RouterModule,
    ItemItemCFInputs
  ],
  templateUrl: './item-similarity.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemSimilarity {
  @Input() medium!: string;
  @Input() model!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.recommendFnReady.emit(this.recommend);
    });
  }
  
  readonly Info = Info;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

  onItemSelected(item: string | null) {
    this.selectedItem.set(item);
  }

  onQueryChange(query: string) {
    this.searchQuery.set(query)
  }

  private recommend: RecommendFn = async () => {
    const query = this.selectedItem() ?? this.searchQuery();

    if (!query) return;

    const method = this.selectedItem()
      ? fetchItemSimilarityRecommendations
      : fetchItemSimilarityDescriptionRecommendations;

    const results = await method(query, this.numRecommendations);

    this.resultsReady.emit(results ?? []);
  };

}
