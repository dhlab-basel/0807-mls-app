import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlemComponent } from './editlem.component';

describe('EditlemComponent', () => {
  let component: EditlemComponent;
  let fixture: ComponentFixture<EditlemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditlemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
