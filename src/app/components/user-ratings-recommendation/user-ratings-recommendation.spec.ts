import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRatingsRecommendation } from './user-ratings-recommendation';

describe('UserRatingsRecommendation', () => {
  let component: UserRatingsRecommendation;
  let fixture: ComponentFixture<UserRatingsRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRatingsRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRatingsRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
