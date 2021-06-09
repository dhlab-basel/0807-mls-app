import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsitemViewerComponent } from './newsitem-viewer.component';

describe('NewsitemViewerComponent', () => {
  let component: NewsitemViewerComponent;
  let fixture: ComponentFixture<NewsitemViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsitemViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsitemViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
