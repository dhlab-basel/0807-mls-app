import { TestBed } from '@angular/core/testing';

import { GetLemmataService } from './get-lemmata.service';

describe('GetLemmataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLemmataService = TestBed.get(GetLemmataService);
    expect(service).toBeTruthy();
  });
});
