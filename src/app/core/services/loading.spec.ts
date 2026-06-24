import { TestBed } from '@angular/core/testing';
import { Loading } from './loading';

describe('Loading', () => {
  let service: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Loading);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be loading initially', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should be loading when a request starts', () => {
    service.start();
    expect(service.isLoading()).toBe(true);
  });

  it('should stop loading when request completes', () => {
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('should track multiple concurrent requests', () => {
    service.start();
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(true);

    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('should not go below zero active requests', () => {
    service.stop();
    expect(service.isLoading()).toBe(false);
  });
});
