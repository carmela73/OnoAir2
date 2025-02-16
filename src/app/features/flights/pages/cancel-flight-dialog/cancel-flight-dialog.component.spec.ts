import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelFlightDialogComponent } from './cancel-flight-dialog.component';

describe('CancelFlightDialogComponent', () => {
  let component: CancelFlightDialogComponent;
  let fixture: ComponentFixture<CancelFlightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelFlightDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelFlightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
