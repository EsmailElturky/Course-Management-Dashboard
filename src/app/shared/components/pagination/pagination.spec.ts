import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let fixture: ComponentFixture<Pagination>;
  let component: Pagination;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('total', 20);
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('pageSize', 6);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render pagination controls', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.page-link');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should emit pageChange when a page is selected', () => {
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component['goToPage'](2);

    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should not emit when selecting the current page', () => {
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component['goToPage'](1);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
