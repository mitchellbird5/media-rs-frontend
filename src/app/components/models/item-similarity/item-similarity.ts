import { 
  Component,
  Input, 
  Output,
  signal,
  EventEmitter,
  WritableSignal,
  effect,
  InputSignal,
  input
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

import { createItemSimilarityRecommendFn } from './item-similarity-recommend-fn';

import { ItemSimilarityMetaData, RecommendFn } from '../../../types/model.types';

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
  ],
  templateUrl: './item-similarity.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemSimilarity {
  @Input() medium!: string;
  numRecommendations: InputSignal<number> = input.required<number>();
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;
  
  placeholder: string = `Search ${this.medium}s...`;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();
  
  private latestMetaData: WritableSignal<ItemSimilarityMetaData | null> = signal(null);

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

  constructor() {
    effect(() => {
      const meta = this.latestMetaData();
      const n = this.numRecommendations();

      if (!meta) return;

      const recommendFn = createItemSimilarityRecommendFn(
        meta,
        this.loading,
        this.resultsChange,
        n,
        this.medium
      );

      this.recommendFnReady.emit(recommendFn);
    });
  }

  onMetaDataChange(metaData: ItemSimilarityMetaData) {
    this.latestMetaData.set(metaData);
  }


}