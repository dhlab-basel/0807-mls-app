import { TestBed } from '@angular/core/testing';

import { KnoraApiService } from './knora-api.service';

describe('KnoraApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KnoraApiService = TestBed.get(KnoraApiService);
    expect(service).toBeTruthy();
  });
});
