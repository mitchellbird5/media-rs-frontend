import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridRecommendation } from './hybrid';

describe('HybridRecommendation', () => {
  let component: HybridRecommendation;
  let fixture: ComponentFixture<HybridRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HybridRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HybridRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
