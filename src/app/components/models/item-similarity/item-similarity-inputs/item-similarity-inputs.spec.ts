import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSimilarityInputs } from './item-similarity-inputs';

describe('ItemSimilarityInputs', () => {
  let component: ItemSimilarityInputs;
  let fixture: ComponentFixture<ItemSimilarityInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSimilarityInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSimilarityInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
