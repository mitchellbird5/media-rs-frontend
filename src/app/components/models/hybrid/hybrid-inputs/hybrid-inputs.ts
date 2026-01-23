import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info } from 'lucide-angular';
import { RouterModule } from '@angular/router';

import { ModelInfo } from '../../../model-info/model-info';
import { Rating } from '../../../../services/recommend/get-user-user-cf-recommendation';
import { HybridWeightSlidersComponent } from './hybrid-weight-sliders/hybrid-weight-sliders';
import { ItemItemCFInputs } from '../../item-item-cf/item-item-cf-inputs/item-item-cf-inputs';
import { UserUserCFInputs } from '../../user-user-cf/user-user-cf-inputs/user-user-cf-inputs';
import { PopupDirective } from '../../../popup-card/popup-directive/popup-directive';

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
    PopupDirective,
    ModelInfo
  ],
  templateUrl: './hybrid-inputs.html',
  styleUrls: [
    './hybrid-inputs.css',
    '../../../../styles/model.css'
  ],
})
export class HybridInputs {
  @Input() medium!: string;
  @Input() width: string = '400px';

  @Output() selectedItemChange = new EventEmitter<string | null>();
  @Output() ratingsChange = new EventEmitter<Rating[]>();
  @Output() numSimilarUsersChange = new EventEmitter<number>();
  @Output() weightsChange = new EventEmitter<{
    alpha: number;
    beta: number;
  }>();

  readonly Info = Info;

  onNumSimilarUsersChange(value: number) {
    this.numSimilarUsersChange.emit(value);
  }

  onHybridWeightsChange(values: { alpha: number; beta: number }) {
    this.weightsChange.emit({alpha: values.alpha, beta: values.beta})
  }

  onRatingsChange(ratings: Rating[]) {
    this.ratingsChange.emit(ratings);
  }

  onUpdateSelectedItem(item: string | null) {
    this.selectedItemChange.emit(item);
  }

}
