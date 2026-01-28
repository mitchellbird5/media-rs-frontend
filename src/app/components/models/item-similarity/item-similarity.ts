import { 
  Component,
  Input, 
  Output,
  signal,
  EventEmitter,
  WritableSignal,
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

import { ItemSimilarityMetaData } from '../../../types/model.types';
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
  ],
  templateUrl: './item-similarity.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemSimilarity {
  @Input() medium!: string;
  @Input() numRecommendations!: number;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;
  @Input() width: string = '400px';

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();
  
  private latestMetaData: ItemSimilarityMetaData | null = null;

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'Item Similarity Recommendation';
  info_description =
    `Recommend items that are similar to the selected items, or the given description, based on similarity of content using sentence transformers (all-MiniLM-L6-v2) aka SBERT.`;

  constructor(private route: ActivatedRoute) {}

  onMetaDataChange(metaData: ItemSimilarityMetaData) {
    console.log('Upating metadata', metaData, 'Returning empty results')
    this.latestMetaData = metaData;

    console.log('Updating recommendFn with metaData', metaData)
    const recommendFn = createItemSimilarityRecommendFn(
      this.latestMetaData,
      this.loading,
      this.resultsChange,
      this.numRecommendations
    );

    this.recommendFnReady.emit(recommendFn);
  }

}