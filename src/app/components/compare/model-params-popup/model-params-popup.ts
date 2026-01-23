import { 
  Component,
  Input,
  Output,
  ViewChild,
  TemplateRef,
  InputSignal,
  input,
  WritableSignal,
  signal,
  EventEmitter 
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemSimilarity } from '../../models/item-similarity/item-similarity';
import { ItemItemCF } from '../../models/item-item-cf/item-item-cf';
import { UserUserCF } from '../../models/user-user-cf/user-user-cf';
import { Hybrid } from '../../models/hybrid/hybrid';

import { ModelType } from '../../../types/model.types';
import { MediumType } from '../../../types/medium.type';
import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-model-params-popup',
  imports: [
    CommonModule,
    ItemSimilarity,
    ItemItemCF,
    UserUserCF,
    Hybrid
  ],
  templateUrl: './model-params-popup.html',
  styleUrl: './model-params-popup.css',
})
export class ModelParamsPopup {
  @Input() medium!: MediumType;
  @Input() model!: ModelType;
  @Input() numRecommendations: number = 10;

  @Output() resultsChange = new EventEmitter<string[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() recommendFnReady = new EventEmitter<RecommendFn>();

  @ViewChild('modelParamsPopup', { static: true })
  template!: TemplateRef<any>;
}
