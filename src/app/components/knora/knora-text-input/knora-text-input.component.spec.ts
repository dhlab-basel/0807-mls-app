import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KnoraTextInputComponent } from './knora-text-input.component';

describe('KnoraTextInputComponent', () => {
  let component: KnoraTextInputComponent;
  let fixture: ComponentFixture<KnoraTextInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KnoraTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnoraTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
