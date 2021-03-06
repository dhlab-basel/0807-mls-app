import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AindexComponent } from './aindex.component';

describe('AindexComponent', () => {
  let component: AindexComponent;
  let fixture: ComponentFixture<AindexComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
