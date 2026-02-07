import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookResultCard } from './book-result-card';

describe('BookResultCard', () => {
  let component: BookResultCard;
  let fixture: ComponentFixture<BookResultCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookResultCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookResultCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
