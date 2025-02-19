import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cancel-flight-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cancel-flight-dialog.component.html',
  styleUrls: ['./cancel-flight-dialog.component.css']
})
export class CancelFlightDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelFlightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { flightNumber: string, errorMessage?: string, confirmMessage?: string }
  ) {}

  closeDialog() : void {
    this.dialogRef.close(false);
  }

  confirmCancel(): void {
    this.dialogRef.close(true);
  }

}
