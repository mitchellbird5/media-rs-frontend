import { 
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  InputSignal,
  input,
  computed,
  effect  
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelParamsPopup } from '../model-params-popup/model-params-popup';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

import { createItemItemCFRecommendFn } from '../../models/item-item-cf/item-item-cf-recommend-fn';
import { createItemSimilarityRecommendFn } from '../../models/item-similarity/item-similarity-recommend-fn';
import { createUserUserCFRecommendFn } from '../../models/user-user-cf/user-user-cf-recommend-fn';
import { createHybridRecommendFn } from '../../models/hybrid/hybrid-recommend-fn';

import { MediumType } from '../../../types/medium.type';
import { 
  ModelType, 
  ModelTitles, 
  ModelMetaData,
  nullMetaData 
} from '../../../types/model.types';
import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-compare-model-params',
  imports: [
    CommonModule,
    PopupDirective
  ],
  templateUrl: './compare-model-params.html',
  styleUrls: [
    './compare-model-params.css',
    '../../../styles/model.css',
    '../../../styles/button.css'
  ],
})
export class CompareModelParams {
  showModel: WritableSignal<boolean> = signal(false);
  medium: InputSignal<MediumType> = input.required<MediumType>();
  model: InputSignal<ModelType> = input.required<ModelType>();
  currentMetaData!: WritableSignal<ModelMetaData>;

  numRecommendations: InputSignal<number> = input.required<number>();
  @Input() set metaData(value: ModelMetaData) {
    if (!value) return;
    if (!this.currentMetaData) {
      this.currentMetaData = signal(value);
      return;
    }
    this.currentMetaData.set(value);
  }

  modelTitle = computed(() => ModelTitles[this.model()]);

  @Output() showModelChange = new EventEmitter<boolean>();
  @Output() results = new EventEmitter<string[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() recommendFn = new EventEmitter<RecommendFn>();
  @Output() metaDataChange = new EventEmitter<ModelMetaData>();

  readonly ModelTitles = ModelTitles;
  readonly ModelParamsPopup = ModelParamsPopup;

  constructor() {
    // Watch for changes to numRecommendations or currentMetaData
    effect(() => {
      const meta = this.currentMetaData?.();
      const numRecs = this.numRecommendations();
      
      if (!meta) return;

      // Regenerate recommendFn when either changes
      this.regenerateRecommendFn(meta, numRecs);
    });
  }

  private regenerateRecommendFn(metaData: ModelMetaData, numRecs: number) {
    const methodMap: Record<string, Function> = {
      'item-similarity': createItemSimilarityRecommendFn,
      'item-item-cf': createItemItemCFRecommendFn,
      'user-user-cf': createUserUserCFRecommendFn,
      'hybrid': createHybridRecommendFn
    };

    const method = methodMap[this.model()];
    if (!method) {
      console.warn('Unknown model type:', this.model());
      return;
    }

    const recommendFn: RecommendFn = method(
      metaData,
      this.loading,
      this.results,
      numRecs,
      this.medium()
    );

    this.recommendFn.emit(recommendFn);
  }

  onResultsChange(results: string[]) {
    this.results.emit(results);
  }

  clearModel() {
    this.onResultsChange([]);
    const resetMeta = nullMetaData[this.model()];
    this.currentMetaData.set(resetMeta);
    this.metaDataChange.emit(resetMeta);
  }

  onMetaDataChange(metaData: ModelMetaData) {
    this.currentMetaData.set(metaData); 
    this.metaDataChange.emit(metaData);
  }

  onShowModel(show: boolean) {
    this.showModel.set(show);
    this.showModelChange.emit(show);
    this.clearModel();
  }

  onShowModelChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.onShowModel(checkbox.checked);
  }

}