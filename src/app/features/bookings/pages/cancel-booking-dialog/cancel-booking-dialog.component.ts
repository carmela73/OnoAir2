import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cancel-booking-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './cancel-booking-dialog.component.html',
  styleUrl: './cancel-booking-dialog.component.css'
})

export class CancelBookingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: string }
  ) {}

  confirm(): void {
    this.dialogRef.close(true); 
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
