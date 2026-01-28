import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter
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
import { EmbeddingMethod, ItemSimilarityMetaData } from '../../../../types/model.types';

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
  @Input() width: string = '400px';

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');
  selectedEmbedding: WritableSignal<EmbeddingMethod> = signal('SBERT');

  @Output() metaDataChange = new EventEmitter<ItemSimilarityMetaData>();

  constructor(private route: ActivatedRoute) {}

  private metaData = signal<ItemSimilarityMetaData>({
    selectedItem: this.selectedItem(),
    query: this.searchQuery(),
    embeddingMethod: this.selectedEmbedding()
  });

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

  autocompleteSearch = async (query: string): Promise<string[]> => {
    return await fetchMovieTitles(query, 5);
  };

  popupSearch = async (query: string): Promise<string[]> => {
    return await fetchMovieTitles(query, 50);
  };

  onItemSelected(item: string | null) {
    this.selectedItem.set(item);
    this.updateMetaData('selectedItem', item);
  }

  onQueryUpdate(query: string) {
    this.searchQuery.set(query);
    this.updateMetaData('query', query);
  }

  clearSelectedItem() {
    this.onItemSelected(null);
    this.onQueryUpdate('');
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.onQueryUpdate('');
  };

  onSelectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding.set(embedding);
    this.updateMetaData('embeddingMethod', embedding);
  }
}