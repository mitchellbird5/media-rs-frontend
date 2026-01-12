import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSimilarityRecommendationInputs } from './item-similarity';

describe('ItemSimilarityRecommendationInputs', () => {
  let component: ItemSimilarityRecommendationInputs;
  let fixture: ComponentFixture<ItemSimilarityRecommendationInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSimilarityRecommendationInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSimilarityRecommendationInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
