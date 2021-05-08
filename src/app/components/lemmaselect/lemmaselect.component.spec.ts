import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmaselectComponent } from './lemmaselect.component';

describe('LemmaselectComponent', () => {
  let component: LemmaselectComponent;
  let fixture: ComponentFixture<LemmaselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemmaselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
