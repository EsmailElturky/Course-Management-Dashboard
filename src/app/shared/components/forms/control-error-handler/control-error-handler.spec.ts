import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlErrorHandler } from './control-error-handler';

describe('ControlErrorHandler', () => {
  let fixture: ComponentFixture<ControlErrorHandler>;
  let component: ControlErrorHandler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlErrorHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlErrorHandler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
