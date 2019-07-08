import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmataComponent } from './lemmata.component';

describe('LemmataComponent', () => {
  let component: LemmataComponent;
  let fixture: ComponentFixture<LemmataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LemmataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
