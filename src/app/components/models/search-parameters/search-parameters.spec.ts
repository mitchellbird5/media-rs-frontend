import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchParameters } from './search-parameters';

describe('SearchParameters', () => {
  let component: SearchParameters;
  let fixture: ComponentFixture<SearchParameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchParameters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchParameters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
