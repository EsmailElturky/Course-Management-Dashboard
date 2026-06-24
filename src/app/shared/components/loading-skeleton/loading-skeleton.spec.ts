import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSkeleton } from './loading-skeleton';

describe('LoadingSkeleton', () => {
  let fixture: ComponentFixture<LoadingSkeleton>;
  let component: LoadingSkeleton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSkeleton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', 3);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card skeleton items by default', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(cards.length).toBe(3);
  });

  it('should render table skeleton rows when variant is table-row', () => {
    fixture.componentRef.setInput('variant', 'table-row');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });
});
