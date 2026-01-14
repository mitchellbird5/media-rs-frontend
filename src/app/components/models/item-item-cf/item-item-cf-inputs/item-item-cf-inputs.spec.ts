import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemItemCfInputs } from './item-item-cf-inputs';

describe('ItemItemCfInputs', () => {
  let component: ItemItemCfInputs;
  let fixture: ComponentFixture<ItemItemCfInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemItemCfInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemItemCfInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
