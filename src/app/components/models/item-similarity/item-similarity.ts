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
import { ItemSimilarityInputs } from './item-similarity-inputs/item-similarity-inputs';

import { 
  fetchItemSimilarityRecommendations,
  fetchItemSimilarityDescriptionRecommendations
} from '../../../services/recommend/get-item-similarity-recommendation';
import { EmbeddingMethod } from '../../../types/model.types';
import { EmbeddingOption } from '../embedding-option/embedding-option';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-item-similarity',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    CommonModule,
    RouterModule,
    ItemSimilarityInputs,
    EmbeddingOption
  ],
  templateUrl: './item-similarity.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemSimilarity {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');
  selectedEmbedding: WritableSignal<EmbeddingMethod> = signal('SBERT');

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.recommendFnReady.emit(this.recommend);
    });
  }
  
  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

  onItemSelected(item: string | null) {
    this.selectedItem.set(item);
  }

  onQueryChange(query: string) {
    this.searchQuery.set(query)
  }

  onResultsChange(results: string[]) {
    this.resultsChange.emit(results);
  }

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding.set(embedding);
  }

  private recommend: RecommendFn = async () => {
    this.loading.emit(true);
    const query = this.selectedItem() ?? this.searchQuery();
    console.log('query', query)

    if (!query) {
      return;
    } 

    const method = this.selectedItem()
      ? fetchItemSimilarityRecommendations
      : fetchItemSimilarityDescriptionRecommendations;

    const results = await method(
      query, 
      this.numRecommendations, 
      this.selectedEmbedding()
    );
    this.onResultsChange(results ?? []);
    this.loading.emit(false);
  };

}
