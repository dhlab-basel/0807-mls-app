import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LemmataComponent } from './lemmata.component';

describe('LemmataComponent', () => {
  let component: LemmataComponent;
  let fixture: ComponentFixture<LemmataComponent>;

  beforeEach(waitForAsync(() => {
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
