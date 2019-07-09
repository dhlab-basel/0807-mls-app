import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmaComponent } from './lemma.component';

describe('LemmaComponent', () => {
  let component: LemmaComponent;
  let fixture: ComponentFixture<LemmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LemmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
