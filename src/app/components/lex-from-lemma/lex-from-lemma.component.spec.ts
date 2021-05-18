import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LexFromLemmaComponent } from './lex-from-lemma.component';

describe('LexFromLemmaComponent', () => {
  let component: LexFromLemmaComponent;
  let fixture: ComponentFixture<LexFromLemmaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LexFromLemmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LexFromLemmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
