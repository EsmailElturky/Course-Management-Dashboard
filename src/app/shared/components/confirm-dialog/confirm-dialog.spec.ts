import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from '../../../core';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
    }).compileComponents();

    confirmationService = TestBed.inject(ConfirmationService);
    fixture = TestBed.createComponent(ConfirmDialog);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
