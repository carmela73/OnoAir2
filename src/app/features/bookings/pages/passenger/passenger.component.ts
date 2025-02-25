import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Passenger, Luggage } from '../../model/booking.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LuggageComponent } from '../luggage/luggage.component';

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [CommonModule, MatCardModule, LuggageComponent, MatButtonModule, LuggageComponent ],
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css']
})

export class PassengerComponent {
  @Input() passenger!: Passenger;
  @Input() bookingId!: string;
  @Output() manageLuggage = new EventEmitter<{ bookingId: string, passportNumber: string, currentLuggage?: Luggage }>();

  openLuggageDialog(): void {
    this.manageLuggage.emit({ 
      bookingId: this.bookingId, 
      passportNumber: this.passenger.passportNumber, 
      currentLuggage: this.passenger.luggage 
    });
  }

}
