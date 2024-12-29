import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDestinationComponent } from './view-destination.component';

describe('ViewDestinationComponent', () => {
  let component: ViewDestinationComponent;
  let fixture: ComponentFixture<ViewDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDestinationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
