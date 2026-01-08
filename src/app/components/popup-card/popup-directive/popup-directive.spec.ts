import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDirective } from './popup-directive';

describe('PopupDirective', () => {
  let component: PopupDirective;
  let fixture: ComponentFixture<PopupDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupDirective]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDirective);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
