import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store confirmation request', () => {
    service.confirm({
      header: 'Delete',
      message: 'Are you sure?',
      accept: () => {},
    });

    expect(service.request()?.header).toBe('Delete');
    expect(service.request()?.acceptLabel).toBe('Yes');
    expect(service.request()?.rejectLabel).toBe('No');
  });
});
