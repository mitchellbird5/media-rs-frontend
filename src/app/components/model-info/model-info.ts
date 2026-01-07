import { 
  Component, 
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-model-info',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './model-info.html',
  styleUrl: './model-info.css',
})
export class ModelInfo {
  @Input() title!: string;
  @Input() description!: string;

  @Output() close = new EventEmitter<void>();

  readonly X = X;

  onClose() {
    this.close.emit();
  }
}
