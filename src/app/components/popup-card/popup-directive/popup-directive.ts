import { 
  Directive, 
  Input, 
  HostListener, 
  ComponentRef, 
  ApplicationRef, 
  EventEmitter, 
  inject 
} from '@angular/core';
import { createComponent } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupShellComponent } from '../popup-shell/popup-shell';

// Generic type for Angular components (works in all Angular versions)
export type AngularComponent<T = any> = new (...args: any[]) => T;

@Directive({
  selector: '[appPopup]',
  exportAs: 'appPopup',
  standalone: true,
})
export class PopupDirective {
  @Input() popupComponent!: AngularComponent; // Dynamic component to render
  @Input() popupContext: any = {}; // Inputs / EventEmitters
  @Input() zIndex: number = 1000;

  private popupRef?: ComponentRef<any>;
  private shellRef?: ComponentRef<PopupShellComponent>;
  private appRef = inject(ApplicationRef);
  private subscriptions: Subscription[] = [];

  public isOpen: boolean = false;

  @HostListener('click', ['$event'])
  @HostListener('touchend', ['$event']) // Add touch support
  handleHostClick(event: MouseEvent | TouchEvent) {
    event.preventDefault(); // Prevent ghost clicks on mobile
    event.stopPropagation();
    
    if (!this.isOpen) {
      this.open();
    }
  }

  open(context?: any) {
    if (this.isOpen) return;

    this.isOpen = true;

    if (context) {
      this.popupContext = { ...this.popupContext, ...context };
    }

    this.shellRef = createComponent(PopupShellComponent, {
      environmentInjector: this.appRef.injector,
    });

    this.shellRef.instance.overlayZIndex = this.zIndex;
    this.shellRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(this.shellRef.hostView);
    document.body.appendChild(this.shellRef.location.nativeElement);

    const host = this.shellRef.instance.host;

    this.popupRef = host.createComponent(this.popupComponent, {
      environmentInjector: this.appRef.injector,
    });

    // Assign context properties to the popup instance
    for (const key of Object.keys(this.popupContext)) {
      const contextValue = this.popupContext[key];
      
      // Skip if it's an EventEmitter - we'll wire those separately
      if (contextValue instanceof EventEmitter) {
        continue;
      }
      
      // Assign non-EventEmitter properties
      this.popupRef.instance[key] = contextValue;
    }

    // Wire up EventEmitters separately with guards
    for (const key of Object.keys(this.popupContext)) {
      const contextValue = this.popupContext[key];
      const instanceValue = this.popupRef.instance[key];
      
      // Only wire if:
      // 1. Context value is an EventEmitter
      // 2. Instance has an EventEmitter with the same name
      // 3. They are DIFFERENT instances
      if (
        contextValue instanceof EventEmitter && 
        instanceValue instanceof EventEmitter &&
        contextValue !== instanceValue
      ) {
        // Subscribe to popup's EventEmitter and forward to parent's EventEmitter
        const sub = instanceValue.subscribe({
          next: (v: any) => {
            // Use setTimeout to break synchronous emission chain
            setTimeout(() => {
              if (this.isOpen) {
                contextValue.emit(v);
              }
            }, 0);
          }
        });
        this.subscriptions.push(sub);
      }
    }

    this.popupRef.changeDetectorRef.detectChanges();
  }

  refresh = () => {
    this.popupRef?.changeDetectorRef.detectChanges();
  };

  close() {
    if (!this.isOpen) return;

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    if (this.popupRef) {
      this.appRef.detachView(this.popupRef.hostView);
      this.popupRef.destroy();
      this.popupRef = undefined;
    }

    if (this.shellRef) {
      this.appRef.detachView(this.shellRef.hostView);
      this.shellRef.destroy();
      this.shellRef = undefined;
    }

    this.isOpen = false;
  }

  ngOnDestroy() {
    this.close();
  }

}
