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

import { fetchMediaTitles } from '../../../../services/databaseSearch';

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
  @Input() placeholder!: string;
  @Input() autocompleteZIndex!: number;
  @Input() searchResultPopupZIndex!: number;
  
  @Input() set metaDataInput(value: ItemItemCFMetaData) {
    if (value) {
      this._metaDataInput = value;
      this.metaData.set(value);
    }
  }
  get metaDataInput(): ItemItemCFMetaData {
    return this._metaDataInput;
  }
  private _metaDataInput!: ItemItemCFMetaData;

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
    return await fetchMediaTitles(query, this.medium, 5);
  };

  popupSearch = async (query: string): Promise<string[]> => {
    return await fetchMediaTitles(query, this.medium, 50);
  };

  onItemSelected(item: string | null) {
    this.updateMetaData('selectedItem', item);
  }

  clearSelectedItem = () => {
    this.onItemSelected(null);
    this.updateMetaData('selectedItem', null);
    this.resultsChange.emit([]);
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
  };

}
