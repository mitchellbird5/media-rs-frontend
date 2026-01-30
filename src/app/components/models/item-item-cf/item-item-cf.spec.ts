import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemItemCFRecommendation } from './item-item-cf';

describe('ItemItemCfRecommendation', () => {
  let component: ItemItemCFRecommendation;
  let fixture: ComponentFixture<ItemItemCFRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemItemCFRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemItemCFRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
