import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  ComponentRef,
  HostListener,
  ApplicationRef,
  createComponent,
  EmbeddedViewRef,
  effect,
  Signal,
  DestroyRef,
  Injector,
  inject,
} from '@angular/core';
import { PopupShellComponent } from '../popup-shell/popup-shell';

@Directive({
  selector: '[appPopup]',
  standalone: true,
})
export class PopupDirective {
  @Input() popupTemplate!: TemplateRef<any>;
  @Input() popupContext: any = {};

  private popupRef?: ComponentRef<PopupShellComponent>;
  private viewRef?: EmbeddedViewRef<any>;
  
  private injector = inject(Injector);

  constructor(private appRef: ApplicationRef) {}

  @HostListener('click')
  handleHostClick() {
    this.open();
  }

  open(context?: any) {
    if (this.popupRef) return;

    if (context) {
      this.popupContext = context; // keep signals intact
    }

    this.popupRef = createComponent(PopupShellComponent, {
      environmentInjector: this.appRef.injector,
    });

    this.popupRef.instance.close.subscribe(() => this.close());

    // pass popupContext directly without unwrapping signals
    this.viewRef = this.popupTemplate.createEmbeddedView(this.popupContext);

    const container = this.popupRef.location.nativeElement.querySelector('.popup-card');
    this.viewRef.rootNodes.forEach((node) => container.appendChild(node));
    this.viewRef.detectChanges();

    this.appRef.attachView(this.popupRef.hostView);
    document.body.appendChild(this.popupRef.location.nativeElement);

    this.setupReactivity();
  }

  private setupReactivity() {
    if (!this.viewRef) return;

    for (const [key, value] of Object.entries(this.popupContext)) {
      if (this.isSignal(value)) {
        effect(() => {
          value(); // track the signal
          this.viewRef?.detectChanges();
        }, { injector: this.injector });
      }
    }
  }

  private isSignal(value: any): value is Signal<any> {
    return typeof value === 'function' && 'set' in value;
  }

  close() {
    if (!this.popupRef) return;

    this.appRef.detachView(this.popupRef.hostView);
    this.popupRef.destroy();
    this.viewRef?.destroy();

    this.popupRef = undefined;
  }
}
