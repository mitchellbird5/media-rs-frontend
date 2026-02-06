import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailPopup } from './book-detail-popup';

describe('BookDetailPopup', () => {
  let component: BookDetailPopup;
  let fixture: ComponentFixture<BookDetailPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
