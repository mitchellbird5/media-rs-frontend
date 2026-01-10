import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemItemCfRecommendation } from './item-item-cf-recommendation';

describe('ItemItemCfRecommendation', () => {
  let component: ItemItemCfRecommendation;
  let fixture: ComponentFixture<ItemItemCfRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemItemCfRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemItemCfRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
