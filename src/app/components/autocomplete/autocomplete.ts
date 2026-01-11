import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal,
  ViewChild,
  ElementRef,
  Signal,
  WritableSignal,
  effect 
} from '@angular/core';
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
  @Input() width: string = '400px';
  @Input() query: WritableSignal<string> = signal('');
  @Output() valueSelected = new EventEmitter<string>();

  results = signal<string[]>([]);
  isOpen = signal(false);
  loading = signal(false);

  private dropdownEl!: HTMLDivElement;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.dropdownEl = document.createElement('div');
    this.dropdownEl.className = 'autocomplete-dropdown';
    this.dropdownEl.style.position = 'fixed';
    this.dropdownEl.style.zIndex = '20000';
    document.body.appendChild(this.dropdownEl);
  }

  ngOnDestroy() {
    document.body.removeChild(this.dropdownEl);
  }

  async onInput(value: string) {
    this.query.set(value);

    if (!value || value.length < 2) {
      this.results.set([]);
      this.isOpen.set(false);
      this.updateDropdown();
      return;
    }

    this.loading.set(true);

    try {
      const data = await this.fetchResults(this.query());
      this.results.set(data);
      this.isOpen.set(data.length > 0);
      this.updateDropdown();
    } finally {
      this.loading.set(false);
    }
  }

  select(value: string) {
    this.query.set(value);
    this.isOpen.set(false);
    this.updateDropdown();
    this.valueSelected.emit(value);
  }

  closeDropdown() {
    this.isOpen.set(false);
    this.updateDropdown();
  }

  private updateDropdown() {
    if (!this.isOpen() || !this.results().length) {
      this.dropdownEl.style.display = 'none';
      const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
      if (inputEl) inputEl.value = this.query(); // force input to sync with signal
      return;
    }

    const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
    if (inputEl) inputEl.value = this.query(); // force input to sync

    const rect = inputEl.getBoundingClientRect();

    this.dropdownEl.style.display = 'block';
    this.dropdownEl.style.top = `${rect.bottom + window.scrollY}px`;
    this.dropdownEl.style.left = `${rect.left + window.scrollX}px`;
    this.dropdownEl.style.width = `${rect.width}px`;

    this.dropdownEl.innerHTML = '';
    for (const item of this.results()) {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerText = item;
      div.onclick = () => this.select(item);
      this.dropdownEl.appendChild(div);
    }
  }
}
