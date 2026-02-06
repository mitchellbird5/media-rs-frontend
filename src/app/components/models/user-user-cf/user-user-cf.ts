import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  InputSignal,
  input,
  effect,
  WritableSignal,
  signal
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
import { UserUserCFInputs } from './user-user-cf-inputs/user-user-cf-inputs';

import { createUserUserCFRecommendFn } from './user-user-cf-recommend-fn';

import { RecommendFn } from '../../../types/movies.types';
import { UserUserCFMetaData } from '../../../types/model.types';

@Component({
  selector: 'app-user-user-cf',
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    CommonModule,
    RouterModule,
    UserUserCFInputs
  ],
  templateUrl: './user-user-cf.html',
  styleUrls: ['../../../styles/model.css'],
})
export class UserUserCF {
  @Input() medium!: string;
  numRecommendations: InputSignal<number> = input.required<number>();
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex!: number;
  @Input() ratingSummaryZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();

  private latestMetaData: WritableSignal<UserUserCFMetaData | null> = signal(null);

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'User-User Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that other users with similar likes rated highly.`;

  constructor() {
    effect(() => {
      const meta = this.latestMetaData();
      const n = this.numRecommendations();

      if (!meta) return;

      const recommendFn = createUserUserCFRecommendFn(
        meta,
        this.loading,
        this.resultsChange,
        n,
        this.medium
      );

      this.recommendFnReady.emit(recommendFn);
    });
  }

  onMetaDataChange(metaData: UserUserCFMetaData) {
    this.latestMetaData.set(metaData);
  }

}
