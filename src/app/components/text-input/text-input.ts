import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  Signal, 
  WritableSignal, 
  signal 
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
  styleUrls: ['./text-input.css'],
  host: {
    '[style.--input-width]': 'width'
  }
})
export class TextInput {
  @Input() placeholder: string = 'Search...';
  @Input() query: WritableSignal<string> = signal('');
  @Input() width: string = '300px';

  @Output() queryChange = new EventEmitter<string>();

  readonly X = X;
  
  onInputChange(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  clear() {
    this.query.set('');
    this.queryChange.emit('');
  }

}
