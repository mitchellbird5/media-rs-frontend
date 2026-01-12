import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUserCFRecommendation } from './user-user-cf-recommendation';

describe('UserUserCFRecommendation', () => {
  let component: UserUserCFRecommendation;
  let fixture: ComponentFixture<UserUserCFRecommendation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUserCFRecommendation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUserCFRecommendation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
