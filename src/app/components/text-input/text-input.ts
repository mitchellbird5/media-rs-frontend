import { Component, Input, Output, EventEmitter } from '@angular/core';
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
})
export class TextInput {
  @Input() placeholder = 'Search...';
  @Input() query: string = '';
  @Input() width: string = '300px';

  @Output() queryChange = new EventEmitter<string>();

  readonly X = X;
  
  onInputChange(value: string) {
    this.query = value;
    this.queryChange.emit(value);
  }

  clear() {
    this.query = '';
    this.queryChange.emit('');
  }

}
