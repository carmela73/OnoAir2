import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DestinationService } from '../../service/destination.service';

@Component({
  selector: 'app-cancel-destination-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cancel-destination-dialog.component.html',
  styleUrls: ['./cancel-destination-dialog.component.css']
})
export class CancelDestinationDialogComponent {
  errorMessage: string | null = null;
  isProcessing = false;

  constructor(
    public  dialogRef: MatDialogRef<CancelDestinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { destinationCode: string; errorMessage?: string },
    private destinationService: DestinationService
  ) {}

    confirmCancel() {
      this.dialogRef.close(true);
    }
  
    closeDialog() {
      this.dialogRef.close(false);
    }

}
