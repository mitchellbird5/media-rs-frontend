import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSimilarityRecommendation } from './item-similarity-recommendation';

describe('ItemSimilarityRecommendation', () => {
  let component: ItemSimilarityRecommendation;
  let fixture: ComponentFixture<ItemSimilarityRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSimilarityRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSimilarityRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
