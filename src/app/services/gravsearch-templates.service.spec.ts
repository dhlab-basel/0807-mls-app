import { TestBed } from '@angular/core/testing';

import { GravsearchTemplatesService } from './gravsearch-templates.service';

describe('GravsearchTemplatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GravsearchTemplatesService = TestBed.get(GravsearchTemplatesService);
    expect(service).toBeTruthy();
  });
});
