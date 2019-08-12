import { TestBed } from '@angular/core/testing';

import { GetLemmaService } from './get-lemma.service';

describe('GetLemmaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLemmaService = TestBed.get(GetLemmaService);
    expect(service).toBeTruthy();
  });
});
