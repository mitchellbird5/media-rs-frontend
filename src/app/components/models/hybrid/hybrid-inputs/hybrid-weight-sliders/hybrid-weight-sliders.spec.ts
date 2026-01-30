import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridWeightSliders } from './hybrid-weight-sliders';

describe('HybridWeightSliders', () => {
  let component: HybridWeightSliders;
  let fixture: ComponentFixture<HybridWeightSliders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HybridWeightSliders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HybridWeightSliders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
