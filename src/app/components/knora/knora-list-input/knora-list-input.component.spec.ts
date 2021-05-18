import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KnoraListInputComponent } from './knora-list-input.component';

describe('KnoraListInputComponent', () => {
  let component: KnoraListInputComponent;
  let fixture: ComponentFixture<KnoraListInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KnoraListInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnoraListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
