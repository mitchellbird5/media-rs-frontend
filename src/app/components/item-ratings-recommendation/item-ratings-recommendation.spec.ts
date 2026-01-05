import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRatingsRecommendation } from './item-ratings-recommendation';

describe('ItemRatingsRecommendation', () => {
  let component: ItemRatingsRecommendation;
  let fixture: ComponentFixture<ItemRatingsRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRatingsRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemRatingsRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
