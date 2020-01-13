import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnoraLinkInputComponent } from './knora-link-input.component';

describe('KnoraLinkInputComponent', () => {
  let component: KnoraLinkInputComponent;
  let fixture: ComponentFixture<KnoraLinkInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnoraLinkInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnoraLinkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
