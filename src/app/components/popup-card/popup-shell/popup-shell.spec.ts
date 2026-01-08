import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupShell } from './popup-shell';

describe('PopupShell', () => {
  let component: PopupShell;
  let fixture: ComponentFixture<PopupShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
