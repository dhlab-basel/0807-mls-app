import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnoraTextInputComponent } from './knora-text-input.component';

describe('KnoraTextInputComponent', () => {
  let component: KnoraTextInputComponent;
  let fixture: ComponentFixture<KnoraTextInputComponent>;

  beforeEach(async(() => {
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
