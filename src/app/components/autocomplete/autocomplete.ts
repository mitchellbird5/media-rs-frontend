import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TextInput } from '../text-input/text-input';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TextInput
  ],
  templateUrl: './autocomplete.html',
  styleUrls: ['./autocomplete.css']
})
export class AutocompleteComponent {
  @Input() fetchResults!: (query: string) => Promise<string[]>;
  @Input() placeholder: string = 'Search...';

  @Input() query = '';
  @Output() queryChange = new EventEmitter<string>();

  @Output() valueSelected = new EventEmitter<string>();

  results = signal<string[]>([]);
  isOpen = signal(false);
  loading = signal(false);

  async onInput(value: string) {
    this.query = value;
    this.queryChange.emit(value);

    if (!value || value.length < 2) {
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
    this.queryChange.emit(value);
    this.isOpen.set(false);
    this.valueSelected.emit(value);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }
}
