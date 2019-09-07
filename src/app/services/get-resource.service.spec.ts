import { TestBed } from '@angular/core/testing';

import { GetResourceService } from './get-resource.service';

describe('GetResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetResourceService = TestBed.get(GetResourceService);
    expect(service).toBeTruthy();
  });
});
