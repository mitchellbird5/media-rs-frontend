import { 
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemItemCFInputs } from '../../models/item-item-cf/item-item-cf-inputs/item-item-cf-inputs';
import { ItemSimilarityInputs } from '../../models/item-similarity/item-similarity-inputs/item-similarity-inputs';
import { UserUserCFInputs } from '../../models/user-user-cf/user-user-cf-inputs/user-user-cf-inputs';
import { HybridInputs } from '../../models/hybrid/hybrid-inputs/hybrid-inputs';

import { 
  ModelType, 
  ModelMetaData,
  ItemSimilarityMetaData,
  ItemItemCFMetaData,
  UserUserCFMetaData,
  HybridMetaData
} from '../../../types/model.types';
import { MediumType } from '../../../types/medium.type';

@Component({
  selector: 'app-model-params-popup',
  imports: [
    CommonModule,
    ItemItemCFInputs,
    ItemSimilarityInputs,
    UserUserCFInputs,
    HybridInputs
  ],
  templateUrl: './model-params-popup.html',
  styleUrl: './model-params-popup.css',
})
export class ModelParamsPopup {
  @Input() medium!: MediumType;
  @Input() model!: ModelType;
  @Input() metaData!: ModelMetaData;

  @Output() metaDataChange = new EventEmitter<ModelMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  get itemSimilarityMetaData(): ItemSimilarityMetaData | undefined {
    return this.model === ModelType.ItemSimilarity
      ? (this.metaData as ItemSimilarityMetaData)
      : undefined;
  }

  get itemItemCFMetaData(): ItemItemCFMetaData | undefined {
    return this.model === ModelType.ItemItemCF
      ? (this.metaData as ItemItemCFMetaData)
      : undefined;
  }

  get userUserCFMetaData(): UserUserCFMetaData | undefined {
    return this.model === ModelType.UserUserCF
      ? (this.metaData as UserUserCFMetaData)
      : undefined;
  }

  get hybridMetaData(): HybridMetaData | undefined {
    return this.model === ModelType.Hybrid
      ? (this.metaData as HybridMetaData)
      : undefined;
  }
}
