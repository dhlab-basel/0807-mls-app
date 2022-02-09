import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkResolveComponent } from './ark-resolve.component';

describe('ArkResolveComponent', () => {
  let component: ArkResolveComponent;
  let fixture: ComponentFixture<ArkResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkResolveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
