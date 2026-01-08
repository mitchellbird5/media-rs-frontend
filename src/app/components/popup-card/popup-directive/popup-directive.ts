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

  constructor(private appRef: ApplicationRef) {}

  @HostListener('click')
  open() {
    if (this.popupRef) return;

    this.popupRef = createComponent(PopupShellComponent, {
      environmentInjector: this.appRef.injector,
    });

    this.popupRef.instance.close.subscribe(() => this.close());

    this.viewRef = this.popupTemplate.createEmbeddedView(this.popupContext);
    
    const container = this.popupRef.location.nativeElement.querySelector('.popup-card');
    this.viewRef.rootNodes.forEach(node => container.appendChild(node));
    this.viewRef.detectChanges(); // <-- trigger Angular bindings


    this.appRef.attachView(this.popupRef.hostView);
    document.body.appendChild(this.popupRef.location.nativeElement);
  }

  close() {
    if (!this.popupRef) return;

    this.appRef.detachView(this.popupRef.hostView);
    this.popupRef.destroy();
    this.viewRef?.destroy();

    this.popupRef = undefined;
  }
}
