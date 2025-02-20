import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-month-grid-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, FormsModule, MatFormFieldModule], 
  templateUrl: './month-grid-view.component.html',
  styleUrls: ['./month-grid-view.component.css']
})

export class MonthGridViewComponent {
  @Output() monthSelected = new EventEmitter<number | null>();

  selectedMonth: Date | null = null;
  isApplyClicked: boolean = false; 

 
  onMonthSelected(event: Date, datepicker: any) {
    this.selectedMonth = new Date(2025, event.getMonth(), 1);
    datepicker.close();
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedMonth) {
      this.isApplyClicked = true;
      this.monthSelected.emit(this.selectedMonth.getMonth() + 1);
    }
  }

  clearSelection() {
    this.selectedMonth = null;
    this.isApplyClicked = false;
    this.monthSelected.emit(null);
  }  

}
