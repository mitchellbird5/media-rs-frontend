import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareModelParams } from './compare-model-params';

describe('CompareModelParams', () => {
  let component: CompareModelParams;
  let fixture: ComponentFixture<CompareModelParams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareModelParams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareModelParams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
