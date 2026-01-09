import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInfo } from './model-info';

describe('ModelInfo', () => {
  let component: ModelInfo;
  let fixture: ComponentFixture<ModelInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
