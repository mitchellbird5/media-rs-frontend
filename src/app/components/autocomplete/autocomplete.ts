import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete.html',
  styleUrls: ['./autocomplete.css']
})
export class AutocompleteComponent {
  @Input() placeholder = 'Search...';
  @Input() fetchResults!: (query: string) => Promise<string[]>;

  @Output() valueSelected = new EventEmitter<string>();

  query = '';
  results = signal<string[]>([]);
  isOpen = signal(false);
  loading = signal(false);

  async onInput() {
    if (!this.query || this.query.length < 2) {
      this.results.set([]);
      this.isOpen.set(false);
      return;
    }

    this.loading.set(true);

    try {
      const data = await this.fetchResults(this.query);
      this.results.set(data);
      this.isOpen.set(data.length > 0);
    } finally {
      this.loading.set(false);
    }
  }

  select(value: string) {
    this.query = value;
    this.isOpen.set(false);
    this.valueSelected.emit(value);
  }
}
