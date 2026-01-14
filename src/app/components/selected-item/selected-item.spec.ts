import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedItem } from './selected-item';

describe('SelectedItem', () => {
  let component: SelectedItem;
  let fixture: ComponentFixture<SelectedItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
