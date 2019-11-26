import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringValueEditComponent } from './string-value-edit.component';

describe('StringValueEditComponent', () => {
  let component: StringValueEditComponent;
  let fixture: ComponentFixture<StringValueEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringValueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringValueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
