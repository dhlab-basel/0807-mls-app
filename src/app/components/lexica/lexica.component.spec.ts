import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LexicaComponent } from './lexica.component';

describe('LexicaComponent', () => {
  let component: LexicaComponent;
  let fixture: ComponentFixture<LexicaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LexicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
