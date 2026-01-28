import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Info, 
} from 'lucide-angular';
import { ActivatedRoute, RouterModule  } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { ModelInfo } from '../../model-info/model-info';
import { ItemItemCFInputs } from './item-item-cf-inputs/item-item-cf-inputs';
import { createItemItemCFRecommendFn } from './item-item-cf-recommend-fn';

import { RecommendFn } from '../../../types/movies.types';
import { ItemItemCFMetaData } from '../../../types/model.types';

@Component({
  selector: 'app-item-item-cf',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    CommonModule,
    RouterModule,
    ItemItemCFInputs
  ],
  templateUrl: './item-item-cf.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemItemCF {
  @Input() medium!: string;
  @Input() numRecommendations!: number;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() modelInfoPopupZIndex: number = 1000;
  @Input() width: string = '400px';

  placeholder: string = `Search ${this.medium}s...`;

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() resultsChange = new EventEmitter<string[]>();

  private latestMetaData: WritableSignal<ItemItemCFMetaData | null> = signal(null);

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  info_title = 'Item-Item Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that are commonly rated high by users who also enjoyed this particular item.`;

  constructor() {
    effect(() => {
      const meta = this.latestMetaData();
      const n = this.numRecommendations;

      if (!meta?.selectedItem) return;

      const recommendFn = createItemItemCFRecommendFn(
        meta,
        this.loading,
        this.resultsChange,
        n
      );

      this.recommendFnReady.emit(recommendFn);
    });
  }

  onMetaDataChange(metaData: ItemItemCFMetaData) {
    this.latestMetaData.set(metaData);
  }

}