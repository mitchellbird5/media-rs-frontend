import { 
  Component, 
  Input, 
  Output,
  EventEmitter
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
  @Input() numRecommendations!: number;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex!: number;
  @Input() ratingSummaryZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;
  @Input() width: string = '400px';

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();

  private latestMetaData: UserUserCFMetaData | null = null;

  constructor(private route: ActivatedRoute) {}

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'User-User Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that other users with similar likes rated highly.`;

  onMetaDataChange(metaData: UserUserCFMetaData) {
    console.log('Upating metadata', metaData, 'Returning empty results')
    this.latestMetaData = metaData;

    console.log('Updating recommendFn with metaData', metaData)
    const recommendFn = createUserUserCFRecommendFn(
      this.latestMetaData,
      this.loading,
      this.resultsChange,
      this.numRecommendations
    );

    this.recommendFnReady.emit(recommendFn);
  }

}
