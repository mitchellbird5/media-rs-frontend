import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionSimilarityRecommendation } from './description-similarity-recommendation';

describe('DescriptionSimilarityRecommendation', () => {
  let component: DescriptionSimilarityRecommendation;
  let fixture: ComponentFixture<DescriptionSimilarityRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionSimilarityRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionSimilarityRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
