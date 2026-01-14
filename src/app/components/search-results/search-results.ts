import { 
  Component,
  Input,
  ViewChild,
  TemplateRef,
  WritableSignal
} from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults {
  @Input() search_title!: string;
  @Input() loadingSearchResults!: WritableSignal<boolean>;
  @Input() results!: WritableSignal<string[]>;
  @Input() onResultSelected!: (result: string) => void;
  @Input() close!: () => void;

  @ViewChild('searchResultsPopup', { static: true })
  template!: TemplateRef<any>;

  selectResult(result: string) {
    this.onResultSelected(result);
    this.close?.();
  }
}
