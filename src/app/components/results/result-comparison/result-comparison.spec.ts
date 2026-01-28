import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultComparison } from './result-comparison';

describe('ResultComparison', () => {
  let component: ResultComparison;
  let fixture: ComponentFixture<ResultComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultComparison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultComparison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
