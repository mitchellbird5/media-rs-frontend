import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPopup } from './detail-popup';

describe('DetailPopup', () => {
  let component: DetailPopup;
  let fixture: ComponentFixture<DetailPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
