import { 
  Component, 
  Input, 
  Output, 
  EventEmitter,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './text-input.html',
  styleUrls: ['./text-input.css']
})
export class TextInput {
  @Input() placeholder: string = 'Search...';
  @Input({ required: true }) query!: WritableSignal<string>;

  @Output() queryChange = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  readonly X = X;
  
  onInputChange(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  clear() {
    this.query.set('');
    this.queryChange.emit('');
    this.cleared.emit();
  }

}
