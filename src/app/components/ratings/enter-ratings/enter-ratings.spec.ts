import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterRatings } from './enter-ratings';

describe('EnterRatings', () => {
  let component: EnterRatings;
  let fixture: ComponentFixture<EnterRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterRatings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterRatings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
