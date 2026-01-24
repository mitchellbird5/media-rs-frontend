import { 
  Component, 
  EventEmitter, 
  Output, 
  Input,
  ViewChild,
  ViewContainerRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-popup-shell',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styleUrls: ['./popup-shell.css'],
  template: `
    <div 
      class="overlay" 
      (click)="close.emit()"
      [ngStyle]="{'z-index': overlayZIndex}"
    >
      <div class="popup-card" (click)="$event.stopPropagation()">
        <!-- X button -->
        <button class="close-btn popup-close-btn" (click)="close.emit()">
          <lucide-icon [img]="X"></lucide-icon>
        </button>

        <!-- Placeholder where dynamic popup content mounts -->
        <ng-template #popupHost></ng-template>
      </div>
    </div>
  `
})
export class PopupShellComponent {
  @Output() close = new EventEmitter<void>();
  @Input() overlayZIndex: number = 1000;
  readonly X = X;

  @ViewChild('popupHost', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;
}