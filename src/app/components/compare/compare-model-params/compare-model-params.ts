import { 
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
  InputSignal,
  input,
  ViewChild  
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelParamsPopup } from '../model-params-popup/model-params-popup';
import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';

import { MediumType } from '../../../types/medium.type';
import { ModelType, ModelTitles } from '../../../types/model.types';
import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-compare-model-params',
  imports: [
    CommonModule,
    ModelParamsPopup,
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

  @Input() numRecommendations!: number;

  @Output() showModelChange = new EventEmitter<boolean>();
  @Output() results = new EventEmitter<string[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() recommendFn = new EventEmitter<RecommendFn>();

  @ViewChild(ModelParamsPopup) modelParamsPopup!: ModelParamsPopup;

  private resultsChangeEmitter = new EventEmitter<string[]>();
  private loadingEmitter = new EventEmitter<boolean>();
  private recommendFnReadyEmitter = new EventEmitter<RecommendFn>();

  readonly ModelTitles = ModelTitles;
  readonly ModelParamsPopup = ModelParamsPopup;

  ngOnInit() {
    this.resultsChangeEmitter.subscribe(res => this.results.emit(res));
    this.loadingEmitter.subscribe(l => this.loading.emit(l));
    this.recommendFnReadyEmitter.subscribe(fn => this.recommendFn.emit(fn));
  }

  getPopupContext() {
    return {
      medium: this.medium(),
      model: this.model(),
      numRecommendations: this.numRecommendations,
      resultsChange: this.resultsChangeEmitter,
      loading: this.loadingEmitter,
      recommendFnReady: this.recommendFnReadyEmitter
    };
  }
  
  onShowModel(show: boolean) {
    this.showModel.set(show);
    this.showModelChange.emit(show);
  }
}
