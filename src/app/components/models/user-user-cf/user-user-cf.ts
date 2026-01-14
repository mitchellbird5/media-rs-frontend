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
import { Results } from '../../results/results';
import { Rating, fetchUserUserCFRecommendations } from '../../../services/recommend/get-user-user-cf-recommendation'; 
import { ModelInfo } from '../../model-info/model-info';
import { UserUserCFInputs } from './user-user-cf-inputs/user-user-cf-inputs';

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
    UserUserCFInputs
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

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsReady = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.recommendFnReady.emit(this.recommend);
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

  private recommend: RecommendFn = async () => {
    const results = await fetchUserUserCFRecommendations(
      this.ratings(), 
      this.numRecommendations,
      this.numSimilarUsers()
    );

    this.resultsReady.emit(results ?? []);
  }

}
