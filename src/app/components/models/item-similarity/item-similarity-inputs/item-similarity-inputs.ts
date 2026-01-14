import { 
  Component,
  Input,
  Output,
  WritableSignal,
  signal,
  EventEmitter,
  ViewEncapsulation 
} from '@angular/core';
import { ActivatedRoute, RouterModule  } from '@angular/router';
import { 
  LucideAngularModule, 
  Search, 
  Trash2,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

import { fetchMovieTitles } from '../../../../services/movieSearch';
import { SearchBar } from '../../../search-bar/search-bar';

@Component({
  selector: 'app-item-similarity-inputs',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterModule,
    SearchBar
  ],
  templateUrl: './item-similarity-inputs.html',
  styleUrls: ['../../../../styles/selected-item.css'], 
})
export class ItemSimilarityInputs {
  @Input() medium!: string;
  @Input() placeholder!: string;
  @Input() width: string = '400px';

  selectedItem: WritableSignal<string | null> = signal(null);
  searchQuery: WritableSignal<string> = signal('');

  ngOnInit() {
    console.log("selected item", this.selectedItem())
  }

  @Output() selectedItemChange = new EventEmitter<string | null>();
  @Output() searchQueryChange = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {}

  searchResults = signal<string[]>([]);
  loadingSearchResults = signal(false);
  
  readonly Search = Search;
  readonly Trash2 = Trash2;

  search = async (query: string): Promise<string[]> => {
    const titles = await fetchMovieTitles(query, 5);
    return titles;
  }

  onItemSelected(item: string | null) {
    console.log('onItemSelected called with:', JSON.stringify(item));
    this.selectedItem.set(item);
    this.selectedItemChange.emit(item);
  }

  onQueryUpdate(query: string) {
    this.searchQuery.set(query);
    this.searchQueryChange.emit(query);
  }

  clearSelectedItem() {
    this.onItemSelected(null);
    this.onQueryUpdate('');
  }

  onSearchSelect = (item: string) => {
    this.onItemSelected(item);
    this.onQueryUpdate('');
  };

}
