import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})

export class CalendarViewComponent {
  
  @Output() dateRangeSelected = new EventEmitter<[Date | null, Date | null]>();

  departureDate: Date | null = null;
  returnDate: Date | null = null;

  applySelection() {
    if (this.departureDate && this.returnDate) {
        this.dateRangeSelected.emit([this.departureDate, this.returnDate]); 
    }
  }
  
  clearSelection() {
    this.departureDate = null;
    this.returnDate = null;
    this.dateRangeSelected.emit([null, null]);
  }

}
