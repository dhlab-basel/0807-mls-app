import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TheprojectComponent } from './theproject.component';

describe('TheprojectComponent', () => {
  let component: TheprojectComponent;
  let fixture: ComponentFixture<TheprojectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TheprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
