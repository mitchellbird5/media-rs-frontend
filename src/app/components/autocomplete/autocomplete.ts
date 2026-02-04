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
  DestroyRef,
  HostListener 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { TextInput } from '../text-input/text-input';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TextInput,
    OverlayModule
  ],
  templateUrl: './autocomplete.html',
  styleUrls: ['./autocomplete.css']
})
export class AutocompleteComponent {
  @Input({ required: true }) query!: WritableSignal<string>;
  @Input() fetchResults!: (query: string) => Promise<string[]>;
  @Input() placeholder: string = 'Search...';
  @Input() width: string = '400px';
  @Input() zIndex: number = 5
  @Input() forceCloseSignal?: Signal<number>;
  
  @Output() valueSelected = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  @Output() queryChange = new EventEmitter<string>();

  results: WritableSignal<string[]> = signal<string[]>([]);
  isOpen: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);

  private debounceTimer: any = null;
  @Input() debounceMs = 300;

  private dropdownEl?: HTMLDivElement;

  constructor(private host: ElementRef) {}

  private lastForceClose = 0;
  private injector = inject(Injector);

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = this.host.nativeElement.contains(target) || 
                          this.dropdownEl?.contains(target);
    
    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

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

  private _syncQueryEffect = effect(() => {
    const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
    if (inputEl && inputEl.value !== this.query()) {
      inputEl.value = this.query();
    }
  }, { injector: this.injector });

  ngOnDestroy() {
    this.closeDropdown();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  onInput(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  private _debouncedFetchEffect = effect(() => {
    const value = this.query();

    if (!value || value.length < 2) {
      this.closeDropdown();
      return;
    }

    // Clear previous debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      this.loading.set(true);

      try {
        const data = await this.fetchResults(value);
        this.results.set(data);

        if (!data.length) {
          this.closeDropdown();
          return;
        }

        this.isOpen.set(true);

        if (!this.dropdownEl) {
          this.createDropdown();
        }

        requestAnimationFrame(() => {
          this.updateDropdown();
        });
      } finally {
        this.loading.set(false);
      }
    }, this.debounceMs);
  }, { injector: this.injector });

  private createDropdown() {
    this.dropdownEl = document.createElement('div');
    this.dropdownEl.className = 'autocomplete-dropdown';
    this.dropdownEl.style.position = 'fixed';
    this.dropdownEl.style.zIndex = `${this.zIndex}`;
    
    // Prevent touch issues on mobile
    this.dropdownEl.style.touchAction = 'manipulation';
    
    // Use setProperty for vendor-prefixed properties
    this.dropdownEl.style.setProperty('-webkit-tap-highlight-color', 'transparent');
    
    document.body.appendChild(this.dropdownEl);
  }

  select(value: string) {
    if (!value) return;
    this.valueSelected.emit(value);
    this.onInput('');

    // Close dropdown completely
    this.closeDropdown();
  }


  closeDropdown() {
    if (this.dropdownEl) {
      // Safely remove from DOM
      try {
        if (this.dropdownEl.parentElement) {
          this.dropdownEl.parentElement.removeChild(this.dropdownEl);
        }
      } catch (e) {
        console.warn('Error removing dropdown:', e);
      }
      this.dropdownEl = undefined;
    }

    this.isOpen.set(false);
    this.results.set([]);
  }
      
  private updateDropdown() {
    if (!this.dropdownEl) return;

    if (!this.isOpen() || !this.results().length) {
      this.dropdownEl.style.display = 'none';
      return;
    }

    const inputEl = this.host.nativeElement.querySelector('input') as HTMLInputElement;
    if (!inputEl) return;

    const rect = inputEl.getBoundingClientRect();

    this.dropdownEl.style.display = 'block';
    this.dropdownEl.style.top = `${rect.bottom + window.scrollY}px`;
    this.dropdownEl.style.left = `${rect.left + window.scrollX}px`;
    this.dropdownEl.style.width = `${rect.width}px`;
    this.dropdownEl.style.maxHeight = '300px';
    this.dropdownEl.style.overflowY = 'auto';

    // Clear and rebuild
    this.dropdownEl.innerHTML = '';
    
    for (const item of this.results()) {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerText = item;
      
      // Use touchend instead of click for better mobile responsiveness
      const handleSelect = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.select(item);
      };
      
      div.addEventListener('click', handleSelect);
      div.addEventListener('touchend', handleSelect);
      
      this.dropdownEl.appendChild(div);
    }
  }

}
