import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KnoraStringInputComponent } from './knora-string-input.component';

describe('KnoraStringValueComponent', () => {
  let component: KnoraStringInputComponent;
  let fixture: ComponentFixture<KnoraStringInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KnoraStringInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnoraStringInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
