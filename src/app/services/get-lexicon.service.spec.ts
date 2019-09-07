import { TestBed } from '@angular/core/testing';

import { GetLexiconService } from './get-lexicon.service';

describe('GetLexiconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLexiconService = TestBed.get(GetLexiconService);
    expect(service).toBeTruthy();
  });
});
