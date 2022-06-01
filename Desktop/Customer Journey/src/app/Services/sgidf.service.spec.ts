import { TestBed } from '@angular/core/testing';

import { SgidfService } from './sgidf.service';

describe('SgidfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SgidfService = TestBed.get(SgidfService);
    expect(service).toBeTruthy();
  });
});
