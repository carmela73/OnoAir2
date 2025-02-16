import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cancel-destination-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cancel-destination-dialog.component.html',
  styleUrls: ['./cancel-destination-dialog.component.css']
})
export class CancelDestinationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CancelDestinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { destinationCode: string }
  ) {}

  closeDialog(confirm: boolean) {
    this.dialogRef.close(confirm);
  }
}
