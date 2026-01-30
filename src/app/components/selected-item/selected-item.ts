import { 
  Component,
  Input,
  WritableSignal 
} from '@angular/core';
import { 
  LucideAngularModule, 
  Trash2
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-item',
  imports: [
    LucideAngularModule,
    CommonModule
  ],
  templateUrl: './selected-item.html',
  styleUrl: './selected-item.css',
})
export class SelectedItem {
  @Input() label: string = 'Selected Item:'
  @Input() selectedItem!: string | null;
  @Input() clearSelectedItem!: () => void;

  readonly Trash2 = Trash2
}
