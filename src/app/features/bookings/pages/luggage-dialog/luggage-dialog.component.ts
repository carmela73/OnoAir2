import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Luggage } from '../../model/booking.model';

@Component({
  selector: 'app-luggage-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './luggage-dialog.component.html',
  styleUrls: ['./luggage-dialog.component.css']
})

export class LuggageDialogComponent {
  luggage: { cabin: number[], checked: number[], heavy: number[] } = { cabin: [], checked: [], heavy: [] };
  totalItems: number = 0;

  constructor(
    public dialogRef: MatDialogRef<LuggageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; luggage: Luggage }
  ) {
    this.initializeLuggage();
  }

  initializeLuggage(): void {
    this.luggage.cabin = new Array(this.data.luggage.cabin).fill(0);
    this.luggage.checked = new Array(this.data.luggage.checked).fill(0);
    this.luggage.heavy = new Array(this.data.luggage.heavy).fill(0);
    this.validateTotalItems();
  }

  updateLuggage(type: 'cabin' | 'checked' | 'heavy', count: number): void {
    this.luggage[type] = new Array(count).fill(0);
    this.validateTotalItems();
  }

  validateTotalItems(): void {
    this.totalItems = this.luggage.cabin.length + this.luggage.checked.length + this.luggage.heavy.length;
  }

  saveChanges(): void {
    if (this.totalItems <= 9) {
      this.dialogRef.close(this.luggage);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
