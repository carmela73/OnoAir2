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
  luggage: { cabin: (number | null)[], checked: (number | null)[], heavy: (number | null)[] } = { cabin: [], checked: [], heavy: [] };
  totalItems: number = 0;

  cabinCount: number | null = null;
  checkedCount: number | null = null;
  heavyCount: number | null = null;
  
  invalidWeights: { cabin: boolean[], checked: boolean[], heavy: boolean[] } = {
    cabin: [], checked: [], heavy: []
  };

  constructor(
    public dialogRef: MatDialogRef<LuggageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; luggage: Luggage }
  ) {
    this.initializeLuggage();
  }

  initializeLuggage(): void {
    this.cabinCount = this.data.luggage.cabin?.length ?? 0;
    this.checkedCount = this.data.luggage.checked?.length ?? 0;
    this.heavyCount = this.data.luggage.heavy?.length ?? 0;
  
    this.luggage.cabin = this.data.luggage.cabin ? [...this.data.luggage.cabin] : [];
    this.luggage.checked = this.data.luggage.checked ? [...this.data.luggage.checked] : [];
    this.luggage.heavy = this.data.luggage.heavy ? [...this.data.luggage.heavy] : [];

    this.validateTotalItems();
  }

  updateLuggage(type: 'cabin' | 'checked' | 'heavy', count: number): void {
    if (count === null || count < 0) return;
    
    while (this.luggage[type].length < count) {
      this.luggage[type].push(null);  
    }
  
    while (this.luggage[type].length > count) {
      this.luggage[type].pop(); 
    }
  
    this.validateTotalItems();
  }
  
  updateLuggageWeight(type: 'cabin' | 'checked' | 'heavy', index: number): void {
    if (this.luggage[type][index] !== null) {
      this.luggage[type] = [...this.luggage[type]];
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }


  validateTotalItems(): void {
    this.totalItems = (this.luggage.cabin?.length ?? 0) + (this.luggage.checked?.length ?? 0) + (this.luggage.heavy?.length ?? 0);
  }

  saveChanges(): void {
    if (this.totalItems <= 9) {
    const updatedLuggage = new Luggage(
      this.luggage.cabin?.filter((w): w is number => w !== null && w !== undefined).length ? 
        [...this.luggage.cabin.filter((w): w is number => w !== null && w !== undefined)] : undefined,
        
      this.luggage.checked?.filter((w): w is number => w !== null && w !== undefined).length ? 
        [...this.luggage.checked.filter((w): w is number => w !== null && w !== undefined)] : undefined,
        
      this.luggage.heavy?.filter((w): w is number => w !== null && w !== undefined).length ? 
        [...this.luggage.heavy.filter((w): w is number => w !== null && w !== undefined)] : undefined
    );

      this.dialogRef.close(updatedLuggage);
    }
  }
  

  cancel(): void {
    this.dialogRef.close();
  }

}
