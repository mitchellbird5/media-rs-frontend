import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsPopup } from './model-params-popup';

describe('ModelParamsPopup', () => {
  let component: ModelParamsPopup;
  let fixture: ComponentFixture<ModelParamsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelParamsPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelParamsPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
