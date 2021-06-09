import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditnewsComponent } from './editnews.component';

describe('EditnewsComponent', () => {
  let component: EditnewsComponent;
  let fixture: ComponentFixture<EditnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditnewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
