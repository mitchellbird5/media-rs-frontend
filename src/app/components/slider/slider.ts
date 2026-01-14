import {
  Component,
  Input,
  Output,
  EventEmitter,
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
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 1;
  @Input() step: number = 0.01;

  /** width can be px, %, rem, etc */
  @Input() width: string = '100%';

  @Input() value!: number;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event) {
    const newValue = +(event.target as HTMLInputElement).value;
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
