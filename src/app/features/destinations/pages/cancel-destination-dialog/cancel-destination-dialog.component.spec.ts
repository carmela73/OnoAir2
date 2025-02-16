import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDestinationDialogComponent } from './cancel-destination-dialog.component';

describe('CancelDestinationDialogComponent', () => {
  let component: CancelDestinationDialogComponent;
  let fixture: ComponentFixture<CancelDestinationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelDestinationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelDestinationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
