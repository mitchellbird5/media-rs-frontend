import { 
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemItemCFInputs } from '../../models/item-item-cf/item-item-cf-inputs/item-item-cf-inputs';
import { ItemSimilarityInputs } from '../../models/item-similarity/item-similarity-inputs/item-similarity-inputs';

import { 
  ModelType, 
  ModelMetaData,
  ItemSimilarityMetaData,
  ItemItemCFMetaData
} from '../../../types/model.types';
import { MediumType } from '../../../types/medium.type';

@Component({
  selector: 'app-model-params-popup',
  imports: [
    CommonModule,
    ItemItemCFInputs
  ],
  templateUrl: './model-params-popup.html',
  styleUrl: './model-params-popup.css',
})
export class ModelParamsPopup {
  @Input() medium!: MediumType;
  @Input() model!: ModelType;
  @Input() metaData!: ModelMetaData;

  @Output() MetaDataChange = new EventEmitter<ModelMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  ngOnInit() {
    console.log('ModelParamsPopup initialized with metaData:', this.metaData);
  }

  get itemItemCFMetaData(): ItemItemCFMetaData | undefined {
    const result = this.model === ModelType.ItemItemCF
      ? (this.metaData as ItemItemCFMetaData)
      : undefined;
    console.log('itemItemCFMetaData getter called, returning:', result);
    return result;
  }

  get itemSimilarityMetaData(): ItemSimilarityMetaData | undefined {
    return this.model === ModelType.ItemSimilarity
      ? (this.metaData as ItemSimilarityMetaData)
      : undefined;
  }
}
