import { TestBed } from '@angular/core/testing';

import { GetLexicaService } from './get-lexica.service';

describe('GetLexicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLexicaService = TestBed.get(GetLexicaService);
    expect(service).toBeTruthy();
  });
});
