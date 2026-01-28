import { 
  Component, 
  Input, 
  signal,
  Output,
  EventEmitter,
  WritableSignal,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Search, 
  Trash2,
} from 'lucide-angular';
import { ActivatedRoute, RouterModule  } from '@angular/router';

import { SearchBar } from '../../../search-bar/search-bar';
import { SelectedItem } from '../../../selected-item/selected-item';

import { fetchMovieTitles } from '../../../../services/movieSearch';

import { 
  ItemItemCFMetaData,
  nullMetaData,
  ModelType 
} from '../../../../types/model.types';

@Component({
  selector: 'app-item-item-cf-inputs',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    SearchBar,
    SelectedItem
  ],
  templateUrl: './item-item-cf-inputs.html',
  styleUrls: ['../../../../styles/model.css'], 
})
export class ItemItemCFInputs implements OnChanges {
  @Input() medium!: string;
  @Input() placeholder: string = `Search for ${this.medium}s...`;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  @Input() width: string = '400px';
  
  @Input() set metaDataInput(value: ItemItemCFMetaData) {
    console.log('metaDataInput setter called with:', value);
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
      this.searchQuery.set('');
    }
  }
  get metaDataInput(): ItemItemCFMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: ItemItemCFMetaData;

  searchQuery: WritableSignal<string> = signal('');

  @Output() metaDataChange = new EventEmitter<ItemItemCFMetaData>();
  @Output() resultsChange = new EventEmitter<string[]>();

  readonly Search = Search;
  readonly Trash2 = Trash2;

  constructor(private route: ActivatedRoute) {}

  metaData = signal<ItemItemCFMetaData>(nullMetaData[ModelType.ItemItemCF]);

  private updateMetaData<K extends keyof ItemItemCFMetaData>(
    key: K,
    value: ItemItemCFMetaData[K]
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

  ngOnInit() {
    console.log('ItemItemCFInputs initialized with metaDataInput:', this.metaDataInput);
    if (this.metaDataInput) {
      this.metaData.set(this.metaDataInput);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called', changes);
    if (changes['metaDataInput'] && this.metaDataInput) {
      console.log('Syncing metaDataInput:', this.metaDataInput);
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

  clearSelectedItem = () => {
    this.onItemSelected(null);
    this.searchQuery.set('');
    this.updateMetaData('selectedItem', null);
    this.resultsChange.emit([]);
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
  };

}
