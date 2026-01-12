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
  effect,
  inject,
  Injector,
  DestroyRef 
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
  @Input() zIndex: number = 5
  @Input() forceCloseSignal?: Signal<number>;
  
  @Output() valueSelected = new EventEmitter<string>();

  results = signal<string[]>([]);
  isOpen = signal(false);
  loading = signal(false);

  private dropdownEl?: HTMLDivElement;

  constructor(private host: ElementRef) {}

  private lastForceClose = 0;
  private injector = inject(Injector);

  private _forceCloseEffect = effect(
    () => {
      if (!this.forceCloseSignal) return;

      const v = this.forceCloseSignal();
      if (v !== this.lastForceClose) {
        this.lastForceClose = v;
        this.closeDropdown();
      }
    },
    { injector: this.injector }
  );

  ngOnDestroy() {
    // if (this.dropdownEl && this.dropdownEl.parentElement) {
    //   this.dropdownEl.parentElement.removeChild(this.dropdownEl);
    //   this.dropdownEl = undefined;
    // }
    this.closeDropdown();
  }

  async onInput(value: string) {
    this.query.set(value);

    if (!value || value.length < 2) {
      this.closeDropdown();
      return;
    }

    this.loading.set(true);

    try {
      const data = await this.fetchResults(this.query());
      this.results.set(data);

      if (!data.length) {
        this.closeDropdown();
        return;
      }

      this.isOpen.set(true);

      // Create dropdown only if it doesn’t exist
      if (!this.dropdownEl) {
        this.dropdownEl = document.createElement('div');
        this.dropdownEl.className = 'autocomplete-dropdown';
        this.dropdownEl.style.position = 'fixed';
        this.dropdownEl.style.zIndex = `${this.zIndex}`;
        document.body.appendChild(this.dropdownEl);
      }

      this.updateDropdown();
    } finally {
      this.loading.set(false);
    }
  }


  select(value: string) {
    this.query.set(value);
    this.valueSelected.emit(value);

    // Close dropdown completely
    this.closeDropdown();
  }


  closeDropdown() {
    if (!this.dropdownEl) return;

    if (this.dropdownEl.parentElement) {
      this.dropdownEl.parentElement.removeChild(this.dropdownEl);
    }
    this.dropdownEl = undefined;
    this.isOpen.set(false);
  }


  private updateDropdown() {
    if (!this.dropdownEl) return;

    if (!this.isOpen() || !this.results().length) {
      this.dropdownEl.style.display = 'none';
      const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
      if (inputEl) inputEl.value = this.query(); 
      return;
    }

    const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
    if (inputEl) inputEl.value = this.query(); 

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
