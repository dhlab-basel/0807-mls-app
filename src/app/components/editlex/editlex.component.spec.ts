import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlexComponent } from './editlex.component';

describe('EditlexComponent', () => {
  let component: EditlexComponent;
  let fixture: ComponentFixture<EditlexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditlexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
