import { 
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  InputSignal,
  input,
  ViewChild,
  effect  
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelParamsPopup } from '../model-params-popup/model-params-popup';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

import { createItemItemCFRecommendFn } from '../../models/item-item-cf/item-item-cf-recommend-fn';
import { createItemSimilarityRecommendFn } from '../../models/item-similarity/item-similarity-recommend-fn';

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

  @Input() numRecommendations!: number;
  @Input() set metaData(value: ModelMetaData) {
    if (value) {
      this.currentMetaData.set(value);
    }
  }

  @Output() showModelChange = new EventEmitter<boolean>();
  @Output() results = new EventEmitter<string[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() recommendFn = new EventEmitter<RecommendFn>();
  @Output() metaDataChange = new EventEmitter<ModelMetaData>();

  @ViewChild(ModelParamsPopup) modelParamsPopup!: ModelParamsPopup;
  @ViewChild(PopupDirective) popupDirective!: PopupDirective;

  readonly ModelTitles = ModelTitles;
  readonly ModelParamsPopup = ModelParamsPopup;

  constructor() {
    // Use effect to initialize once model is available
    effect(() => {
      if (!this.currentMetaData) {
        this.currentMetaData = signal(nullMetaData[this.model()]);
      }
    }, { allowSignalWrites: true });
  }

  onResultsChange(results: string[]) {
    this.results.emit(results);
  }

  clearModel() {
    console.log('resetting meta...')
    const resetMeta = nullMetaData[this.model()];
    console.log('resetMeta=', resetMeta)
    this.currentMetaData.set(resetMeta);
    this.metaDataChange.emit(resetMeta);
  }

  onMetaDataChange(metaData: ModelMetaData) {
    this.currentMetaData.set(metaData); 

    const methodMap: Record<string, Function> = {
      'item-similarity': createItemSimilarityRecommendFn,
      'item-item-cf': createItemItemCFRecommendFn,
    };

    const method = methodMap[this.model()];
    if (!method) {
      console.warn('Unknown model type:', this.model());
      return;
    }

    const recommendFn: RecommendFn = method(
      this.currentMetaData,
      this.loading,
      this.results,
      this.numRecommendations
    );

    this.recommendFn.emit(recommendFn);
    this.metaDataChange.emit(metaData);
  }


  onShowModel(show: boolean) {
    console.log('onShowModel called with:', show);
    console.log('Current metadata before clear:', this.currentMetaData());
    this.showModel.set(show);
    this.showModelChange.emit(show);
    this.clearModel();
    console.log('Current metadata after clear:', this.currentMetaData());
  }

  onShowModelChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    console.log('Checkbox changed to:', checkbox.checked);
    this.onShowModel(checkbox.checked);
  }

  testLog(event: any) {
    console.log('CHECKBOX EVENT FIRED:', event);
    console.log('Event target:', event.target);
    console.log('Checked value:', event.target.checked);
    const checkbox = event.target as HTMLInputElement;
    this.onShowModel(checkbox.checked);
  }

  onEditClick() {
    console.log('Edit button clicked, passing metadata:', this.currentMetaData());
  }
}