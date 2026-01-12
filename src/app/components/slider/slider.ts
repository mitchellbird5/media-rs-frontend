import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})
export class SliderComponent {
  @Input() label = '';
  @Input() min = 0;
  @Input() max = 1;
  @Input() step = 0.01;

  /** width can be px, %, rem, etc */
  @Input() width: string = '100%';

  @Input() value!: WritableSignal<number>;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event) {
    const newValue = +(event.target as HTMLInputElement).value;
    this.value.set(newValue);
    this.valueChange.emit(newValue);
  }
}
