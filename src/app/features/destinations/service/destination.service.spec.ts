import { TestBed } from '@angular/core/testing';

import { DestinationService } from './destination.service';

describe('DestinationsService', () => {
  let service: DestinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});