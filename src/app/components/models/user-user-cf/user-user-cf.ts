import { 
  Component, 
  Input, 
  Output,
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
} from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { Rating, fetchUserUserCFRecommendations } from '../../../services/recommend/get-user-user-cf-recommendation'; 
import { ModelInfo } from '../../model-info/model-info';
import { UserUserCFInputs } from './user-user-cf-inputs/user-user-cf-inputs';
import { EmbeddingMethod } from '../../../types/model.types';
import { EmbeddingOption } from '../embedding-option/embedding-option';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-user-user-cf',
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    CommonModule,
    ModelInfo,
    RouterModule,
    UserUserCFInputs,
    EmbeddingOption
  ],
  templateUrl: './user-user-cf.html',
  styleUrls: ['../../../styles/model.css'],
})
export class UserUserCF {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  ratings: WritableSignal<Rating[]> = signal([]);
  numSimilarUsers: WritableSignal<number> = signal(25);
  selectedEmbedding: WritableSignal<EmbeddingMethod> = signal('SBERT');

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsReady = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.recommendFnReady.emit(this.recommend);
    });
  }

  loadingRecommendations = signal(false);
  recommendationsReady = signal(true);  // initially true for the sake of spinner logic

  readonly Info = Info;

  info_title = 'User-User Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that other users with similar likes rated highly.`;

  onNumSimilarUsersChange(value: number) {
    this.numSimilarUsers.set(value);
  }

  onRatingsUpdate(ratings: Rating[]) {
    this.ratings.set(ratings);
  }

  onResultsRendered(ready: boolean) {
    this.recommendationsReady.set(ready);
  }

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding.set(embedding);
  }

  private recommend: RecommendFn = async () => {
    this.loading.emit(true);
    const results = await fetchUserUserCFRecommendations(
      this.ratings(), 
      this.numRecommendations,
      this.numSimilarUsers(),
      this.selectedEmbedding()
    );

    this.resultsReady.emit(results ?? []);
    this.loading.emit(false);
  }

}
