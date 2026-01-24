import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  signal,
  WritableSignal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info } from 'lucide-angular';
import { RouterModule } from '@angular/router';

import { ModelInfo } from '../../model-info/model-info';
import { Rating } from '../../../services/recommend/get-user-user-cf-recommendation';
import { fetchHybridRecommendations } from '../../../services/recommend/get-hybrid-recommendation';
import { HybridInputs } from './hybrid-inputs/hybrid-inputs';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { EmbeddingMethod } from '../../../types/model.types';
import { EmbeddingOption } from '../embedding-option/embedding-option';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-hybrid',
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    HybridInputs,
    PopupDirective,
    EmbeddingOption
  ],
  templateUrl: './hybrid.html',
  styleUrls: [
    './hybrid.css',
    '../../../styles/model.css'
  ],
})
export class Hybrid {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsReady = new EventEmitter<string[]>();

  ratings: WritableSignal<Rating[]> = signal([]);
  selectedItem: WritableSignal<string | null> = signal(null);
  alpha: WritableSignal<number> = signal(0.25);
  beta: WritableSignal<number> = signal(0.25);
  numSimilarUsers: WritableSignal<number> = signal(25);
  selectedEmbedding: WritableSignal<EmbeddingMethod> = signal('SBERT');

  ngOnInit() {
    Promise.resolve().then(() => {
      this.recommendFnReady.emit(this.recommend);
    });
  }

  info_title = 'Hybrid Recommendation';
  info_description =
    `Recommend items using a combination of content-similarity filtering, item-item collaborative filtering and user-user collaborative filtering.`;

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  
  onWeightsChange(weights: {alpha: number, beta: number}) {
    this.alpha.set(weights.alpha);
    this.beta.set(weights.beta)
  }

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding.set(embedding);
  }

  private recommend: RecommendFn = async () => {
    this.loading.emit(true);
    const results = await fetchHybridRecommendations(
      this.selectedItem(),
      this.ratings(), 
      this.alpha(),
      this.beta(),
      this.numRecommendations,
      this.numSimilarUsers(),
      this.selectedEmbedding()
    );

    this.resultsReady.emit(results ?? []);
    this.loading.emit(false);
  }


}
