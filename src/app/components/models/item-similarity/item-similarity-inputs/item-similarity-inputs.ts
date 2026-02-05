import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, RouterModule  } from '@angular/router';
import { 
  LucideAngularModule, 
  Search, 
  Trash2,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

import { SearchBar } from '../../../search-bar/search-bar';
import { SelectedItem } from '../../../selected-item/selected-item';
import { EmbeddingOption } from '../../embedding-option/embedding-option';

import { fetchMovieTitles } from '../../../../services/movieSearch';
import { 
  EmbeddingMethod, 
  ItemSimilarityMetaData,
  nullMetaData,
  ModelType 
} from '../../../../types/model.types';

@Component({
  selector: 'app-item-similarity-inputs',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterModule,
    SearchBar,
    SelectedItem,
    EmbeddingOption
  ],
  templateUrl: './item-similarity-inputs.html',
  styleUrls: ['../../../../styles/model.css'], 
})
export class ItemSimilarityInputs {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() embeddingZIndex!: number;

  @Input() set metaDataInput(value: ItemSimilarityMetaData) {
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
    }
  }
  get metaDataInput(): ItemSimilarityMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: ItemSimilarityMetaData;

  @Output() metaDataChange = new EventEmitter<ItemSimilarityMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  metaData = signal<ItemSimilarityMetaData>(nullMetaData[ModelType.ItemSimilarity]);

  private updateMetaData<K extends keyof ItemSimilarityMetaData>(
    key: K,
    value: ItemSimilarityMetaData[K]
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

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);
  
  readonly Search = Search;
  readonly Trash2 = Trash2;

  ngOnInit() {
    if (this.metaDataInput) {
      this.metaData.set(this.metaDataInput);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['metaDataInput'] && this.metaDataInput) {
      this.metaData.set(this.metaDataInput);
    }
  }

  autocompleteSearch = async (query: string): Promise<string[]> => {
    return await fetchMovieTitles(query, 5);
  };

  popupSearch = async (query: string): Promise<string[]> => {
    return await fetchMovieTitles(query, 50);
  };

  onItemSelected(item: string | null) {
    this.updateMetaData('selectedItem', item);
  }

  onQueryUpdate(query: string) {
    this.updateMetaData('query', query);
    if (!this.metaData().selectedItem && query==='') {
      this.resultsChange.emit([])
    }
  }

  clearSelectedItem() {
    this.onItemSelected(null);
    this.onQueryUpdate('');
    this.resultsChange.emit([]);
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.onQueryUpdate('');
  };

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.updateMetaData('embeddingMethod', embedding);
  }
}