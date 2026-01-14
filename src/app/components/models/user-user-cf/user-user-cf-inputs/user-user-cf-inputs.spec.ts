import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUserCFInputs } from './user-user-cf-inputs';

describe('UserUserCFInputs', () => {
  let component: UserUserCFInputs;
  let fixture: ComponentFixture<UserUserCFInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUserCFInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUserCFInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
