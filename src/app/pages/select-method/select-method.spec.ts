import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMethod } from './select-method';

describe('SelectMethod', () => {
  let component: SelectMethod;
  let fixture: ComponentFixture<SelectMethod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMethod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMethod);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
