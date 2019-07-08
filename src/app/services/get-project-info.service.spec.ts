import { TestBed } from '@angular/core/testing';

import { GetProjectInfoService } from './get-project-info.service';

describe('GetProjectInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetProjectInfoService = TestBed.get(GetProjectInfoService);
    expect(service).toBeTruthy();
  });
});
