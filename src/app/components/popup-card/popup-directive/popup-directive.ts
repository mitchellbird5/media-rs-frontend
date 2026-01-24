import { Directive, Input, HostListener, ComponentRef, ApplicationRef, Injector, inject } from '@angular/core';
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
  private opening: boolean = false;

  @HostListener('click')
  handleHostClick() {
    this.open();
  }

  open(context?: any) {
    if (this.popupRef || this.opening) return;

    this.opening = true;
    this.isOpen = true;

    if (context) this.popupContext = context;

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

    Object.assign(this.popupRef.instance, {
      ...this.popupContext,
      close: this.close.bind(this),
      refresh: this.refresh,
    });

    for (const key of Object.keys(this.popupContext)) {
      const value = this.popupContext[key];
      const instanceValue = this.popupRef.instance[key];
      
      if (value?.subscribe && instanceValue?.subscribe) {
        // Only subscribe if both are EventEmitters and they're different instances
        if (value !== instanceValue) {
          const sub = instanceValue.subscribe((v: any) => {
            // Emit asynchronously to break potential synchronous loops
            queueMicrotask(() => {
              if (this.isOpen && value.emit) {
                value.emit(v);
              }
            });
          });
          this.subscriptions.push(sub);
        }
      }
    }

    this.popupRef.changeDetectorRef.detectChanges();
    this.opening = false;
  }

  refresh = () => {
    this.popupRef?.changeDetectorRef.detectChanges();
  };

  close() {
    if (!this.popupRef && !this.shellRef) return;

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
