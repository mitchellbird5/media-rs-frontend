import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter,
} from '@angular/core';
import { 
  LucideAngularModule, 
  Info
} from 'lucide-angular';

import { EnterRatings } from '../../../ratings/enter-ratings/enter-ratings';
import { EmbeddingOption } from '../../embedding-option/embedding-option';
import { SliderComponent } from '../../../slider/slider';

import { 
  Rating, 
  UserUserCFMetaData,
  EmbeddingMethod,
  nullMetaData,
  ModelType 
} from '../../../../types/model.types';

@Component({
  selector: 'app-user-user-cf-inputs',
  standalone: true,
  imports: [
    LucideAngularModule,
    EmbeddingOption,
    EnterRatings,
    SliderComponent
  ],
  templateUrl: './user-user-cf-inputs.html',
  styleUrls: [
    '../../../../styles/button.css',
    '../../../../styles/model.css'
  ], 
})
export class UserUserCFInputs {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() ratingPopupZIndex: number = 1050;
  @Input() ratingSummaryZIndex: number = 1050;
  @Input() width: string = '400px';

  @Input() set metaDataInput(value: UserUserCFMetaData) {
    console.log('metaDataInput setter called with:', value);
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
      this.numSimilarUsers=signal(value.numSimilarUsers);
      this.selectedEmbedding=signal(value.embeddingMethod);
    }
  }
  get metaDataInput(): UserUserCFMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: UserUserCFMetaData;

  numSimilarUsers: WritableSignal<number> = signal(25);
  selectedEmbedding: WritableSignal<EmbeddingMethod> = signal('SBERT');

  @Output() metaDataChange = new EventEmitter<UserUserCFMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info;

  private metaData = signal<UserUserCFMetaData>(nullMetaData[ModelType.UserUserCF]);

  private updateMetaData<K extends keyof UserUserCFMetaData>(
    key: K,
    value: UserUserCFMetaData[K]
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

  onNumSimilarUsersUpdate(users: number) {
    this.numSimilarUsers.set(users);
    this.updateMetaData('numSimilarUsers', users);
  }

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding.set(embedding);
    this.updateMetaData('embeddingMethod', embedding);
  }

  onRatingsChange(ratings: Rating[]) {
    this.updateMetaData('ratings', ratings);
  }

}
