import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLemmaComponent } from './edit-lemma.component';

describe('EditLemmaComponent', () => {
  let component: EditLemmaComponent;
  let fixture: ComponentFixture<EditLemmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLemmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLemmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
