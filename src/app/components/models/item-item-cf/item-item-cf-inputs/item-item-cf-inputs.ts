import { 
  Component, 
  Input, 
  signal,
  Output,
  EventEmitter,
  WritableSignal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Search, 
  Trash2,
} from 'lucide-angular';
import { ActivatedRoute, RouterModule  } from '@angular/router';

import { fetchMovieTitles } from '../../../../services/movieSearch';
import { SearchBar } from '../../../search-bar/search-bar';


@Component({
  selector: 'app-item-item-cf-inputs',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterModule,
    SearchBar
  ],
  templateUrl: './item-item-cf-inputs.html',
  styleUrls: [
    '../../../../styles/selected-item.css',
    '../../../../styles/model.css'
  ], 
})
export class ItemItemCFInputs {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() width: string = '400px';

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');

  @Output() selectedItemChange = new EventEmitter<string | null>();

  constructor(private route: ActivatedRoute) {}

  loadingSearchResults = signal(false);

  readonly Search = Search;
  readonly Trash2 = Trash2;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  onItemSelected(item: string) {
    this.selectedItem.set(item);
    this.selectedItemChange.emit(item);
  }

  clearSelectedItem() {
    this.selectedItem.set(null);
    this.searchQuery.set('');
    this.selectedItemChange.emit(null);
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.searchQuery.set('');
  };

}
