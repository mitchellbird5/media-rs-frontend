import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-popup-shell',
  standalone: true,
  imports: [LucideAngularModule],
  styleUrls: ['./popup-shell.css'],
  template: `
    <div class="overlay" (click)="close.emit()">
      <div class="popup-card" (click)="$event.stopPropagation()">
        <button class="close-btn popup-close-btn" (click)="close.emit()">
          <lucide-icon [img]="X"></lucide-icon>
        </button>

        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PopupShellComponent {
  @Output() close = new EventEmitter<void>();
  readonly X = X;
}
