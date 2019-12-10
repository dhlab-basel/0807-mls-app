import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueEditComponent } from './value-edit.component';

describe('StringValueEditComponent', () => {
  let component: ValueEditComponent;
  let fixture: ComponentFixture<ValueEditComponent>;

  beforeEach(async(() => {
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
