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
import { LucideAngularModule, Info } from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ModelInfo } from '../../model-info/model-info';
import { HybridInputs } from './hybrid-inputs/hybrid-inputs';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

import { createHybridRecommendFn } from './hybrid-recommend-fn';

import { RecommendFn } from '../../../types/movies.types';
import { HybridMetaData } from '../../../types/model.types';

@Component({
  selector: 'app-hybrid',
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    HybridInputs,
    PopupDirective
  ],
  templateUrl: './hybrid.html',
  styleUrls: [
    './hybrid.css',
    '../../../styles/model.css'
  ],
})
export class Hybrid {
  @Input() medium!: string;
  numRecommendations: InputSignal<number> = input.required<number>();
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex!: number;
  @Input() ratingSummaryZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;
  @Input() embeddingZIndex!: number;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();

  private latestMetaData: WritableSignal<HybridMetaData | null> = signal(null);

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'Hybrid Recommendation';
  info_description =
    `Recommend items using a combination of content-similarity filtering, item-item collaborative filtering and user-user collaborative filtering.`;

  constructor() {
    effect(() => {
      const meta = this.latestMetaData();
      const n = this.numRecommendations();

      if (!meta) return;

      const recommendFn = createHybridRecommendFn(
        meta,
        this.loading,
        this.resultsChange,
        n
      );

      this.recommendFnReady.emit(recommendFn);
    });
  }

  onMetaDataChange(metaData: HybridMetaData) {
    this.latestMetaData.set(metaData);
  }

}
