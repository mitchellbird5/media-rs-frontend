import {
  Component,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
  computed,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from '../../../../slider/slider';
@Component({
  selector: 'app-hybrid-weight-sliders',
  standalone: true,
  imports: [CommonModule, SliderComponent],
  templateUrl: './hybrid-weight-sliders.html',
  styleUrl: './hybrid-weight-sliders.css'
})
export class HybridWeightSlidersComponent {
  alpha: WritableSignal<number> = signal(0.5);
  beta: WritableSignal<number> = signal(0.3);

  @Output() valuesChange = new EventEmitter<{
    alpha: number;
    beta: number;
  }>();

  remaining = computed(() => 1 - this.alpha() - this.beta());

  onAlphaChange(value: number) {
    this.alpha.set(value);

    const overflow = this.alpha() + this.beta() - 1;
    if (overflow > 0) {
      this.beta.set(Math.max(0, this.beta() - overflow));
    }

    this.emit();
  }

  onBetaChange(value: number) {
    this.beta.set(value);

    const overflow = this.alpha() + this.beta() - 1;
    if (overflow > 0) {
      this.alpha.set(Math.max(0, this.alpha() - overflow));
    }

    this.emit();
  }

  private emit() {
    this.valuesChange.emit({
      alpha: this.alpha(),
      beta: this.beta()
    });
  }
}
