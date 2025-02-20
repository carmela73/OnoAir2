import { Component, EventEmitter, Output, ChangeDetectorRef  } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { MonthGridViewComponent } from '../month-grid-view/month-grid-view.component';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatButtonToggleModule, CommonModule, CalendarViewComponent, MonthGridViewComponent],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})

export class DatePickerComponent {
  searchMode: 'specific' | 'flexible' = 'specific';
  selectedMonth: number | null = null; 

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthSelected = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  setSearchMode(mode: 'specific' | 'flexible') {
    this.searchMode = mode;
    this.cdr.detectChanges(); 
  }

  onDateSelected(date: Date) {
    this.dateSelected.emit(date);
  }

  onMonthSelected(selectedMonth: number) {
    this.monthSelected.emit(selectedMonth);
  }
  
}
