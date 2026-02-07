import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailPopup } from './movie-detail-popup';

describe('MovieDetailPopup', () => {
  let component: MovieDetailPopup;
  let fixture: ComponentFixture<MovieDetailPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
