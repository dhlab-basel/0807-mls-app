import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValueEditComponent } from './value-edit.component';

describe('StringValueEditComponent', () => {
  let component: ValueEditComponent;
  let fixture: ComponentFixture<ValueEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
