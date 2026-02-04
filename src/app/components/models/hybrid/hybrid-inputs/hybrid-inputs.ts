import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info } from 'lucide-angular';
import { RouterModule } from '@angular/router';

import { ModelInfo } from '../../../model-info/model-info';
import { HybridWeightSlidersComponent } from './hybrid-weight-sliders/hybrid-weight-sliders';
import { ItemItemCFInputs } from '../../item-item-cf/item-item-cf-inputs/item-item-cf-inputs';
import { UserUserCFInputs } from '../../user-user-cf/user-user-cf-inputs/user-user-cf-inputs';
import { PopupDirective } from '../../../popup-card/popup-directive/popup-directive';

import { 
  Rating,
  HybridMetaData,
  ItemItemCFMetaData,
  UserUserCFMetaData,
  nullMetaData,
  ModelType 
} from '../../../../types/model.types';

@Component({
  selector: 'app-hybrid-inputs',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    HybridWeightSlidersComponent,
    ItemItemCFInputs,
    UserUserCFInputs,
    PopupDirective
  ],
  templateUrl: './hybrid-inputs.html',
  styleUrls: [
    './hybrid-inputs.css',
    '../../../../styles/model.css'
  ],
})
export class HybridInputs {
  @Input() medium!: string;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex: number = 1050;
  @Input() ratingSummaryZIndex: number = 1050;

  @Input() set metaDataInput(value: HybridMetaData) {
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
    }
  }
  get metaDataInput(): HybridMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: HybridMetaData;

  ratings = computed(() => this.metaData().userUserCFMetaData.ratings);

  @Output() metaDataChange = new EventEmitter<HybridMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  readonly Info = Info;
  readonly ModelInfo = ModelInfo;

  metaData = signal<HybridMetaData>(nullMetaData[ModelType.Hybrid]);

  private updateMetaData<K extends keyof HybridMetaData>(
    key: K,
    value: HybridMetaData[K]
  ) {
    this.metaData.update(current => {
      const updated = {
        ...current,
        [key]: value,
      };

      this.metaDataChange.emit(updated);
      return updated;
    });
  }

  onItemItemCFMetaDataChange(itemItemCFMetaData: ItemItemCFMetaData) {
    this.updateMetaData('itemItemCFMetaData', itemItemCFMetaData);
  }

  onUserUserCFMetaDataChange(userUserCFMetaData: UserUserCFMetaData) {
    this.updateMetaData('userUserCFMetaData', userUserCFMetaData);
  }

  onHybridWeightsChange(values: { alpha: number; beta: number }) {
    this.updateMetaData('alpha', values.alpha);
    this.updateMetaData('beta', values.beta);
  }
}
