import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddingOption } from './embedding-option';

describe('EmbeddingOption', () => {
  let component: EmbeddingOption;
  let fixture: ComponentFixture<EmbeddingOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbeddingOption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbeddingOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
