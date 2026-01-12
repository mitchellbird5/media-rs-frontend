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
import { HybridWeightSlidersComponent } from '../hybrid-weight-sliders/hybrid-weight-sliders';
import { ItemItemCF } from '../item-item-cf/item-item-cf';
import { UserUserCF } from '../user-user-cf/user-user-cf';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-hybrid',
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    HybridWeightSlidersComponent,
    ItemItemCF,
    UserUserCF,
    PopupDirective,
    ModelInfo
  ],
  templateUrl: './hybrid.html',
  styleUrl: './hybrid.css',
})
export class Hybrid {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();

  ratings: WritableSignal<Rating[]> = signal([]);
  selectedItem: WritableSignal<string | null> = signal(null);
  alpha: WritableSignal<number> = signal(0.25);
  beta: WritableSignal<number> = signal(0.25);
  numSimilarUsers: WritableSignal<number> = signal(25);

  ngOnInit() {
    this.recommendFnReady.emit(this.recommend.bind(this));
  }

  info_title = 'Hybrid Recommendation';
  info_description =
    `Recommend items using a combination of content-similarity filtering, item-item collaborative filtering and user-user collaborative filtering.`;

  readonly Info = Info;

  private recommend: RecommendFn = async () => {
    const results = await fetchHybridRecommendations(
      this.selectedItem(),
      this.ratings(), 
      this.alpha(),
      this.beta(),
      this.numRecommendations,
      this.numSimilarUsers()
    );

    this.resultsReady.emit(results ?? []);
  }

  onNumRecommendationsChange(value: number) {
    this.numRecommendations = value;
  }

  onNumSimilarUsersChange(value: number) {
    this.numSimilarUsers.set(value);
  }

  onHybridWeightsChange(values: { alpha: number; beta: number }) {
    this.alpha.set(values.alpha);
    this.beta.set(values.beta);
  }

  onRatingsChange(ratings: Rating[]) {
    this.ratings.set(ratings);
  }

  onUpdateSelectedItem(item: string | null) {
    this.selectedItem.set(item);
  }

}
