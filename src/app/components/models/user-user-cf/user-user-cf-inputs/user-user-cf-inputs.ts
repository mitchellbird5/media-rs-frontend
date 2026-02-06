import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter,
  computed
} from '@angular/core';
import { 
  LucideAngularModule, 
  Info
} from 'lucide-angular';

import { EnterRatings } from '../../../ratings/enter-ratings/enter-ratings';
import { EmbeddingOption } from '../../embedding-option/embedding-option';
import { SliderComponent } from '../../../slider/slider';

import { fetchMedia } from '../../../../services/databaseSearch';

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
  @Input() embeddingZIndex!: number;

  @Input() set metaDataInput(value: UserUserCFMetaData) {
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
    }
  }
  get metaDataInput(): UserUserCFMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: UserUserCFMetaData;

  ratings = computed(() => this.metaData().ratings);

  @Output() metaDataChange = new EventEmitter<UserUserCFMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);

  readonly Info = Info;

  metaData = signal<UserUserCFMetaData>(nullMetaData[ModelType.UserUserCF]);

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

  autocompleteSearch = async (query: string): Promise<string[]> => {
    const media = await fetchMedia(query, 5, this.medium);
    return media.map((m: any) => m.title);
  };

  popupSearch = async (query: string): Promise<string[]> => {
    const media = await fetchMedia(query, 50, this.medium);
    return media.map((m: any) => m.title);
  };

  onNumSimilarUsersUpdate(users: number) {
    this.updateMetaData('numSimilarUsers', users);
  }

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.updateMetaData('embeddingMethod', embedding);
  }

  onRatingsChange(ratings: Rating[]) {
    this.metaData().ratings.set(ratings);
    this.metaDataChange.emit(this.metaData());
  }

}
