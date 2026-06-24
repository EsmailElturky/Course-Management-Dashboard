import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesDetails } from './courses-details';

describe('CoursesDetails', () => {
  let component: CoursesDetails;
  let fixture: ComponentFixture<CoursesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
