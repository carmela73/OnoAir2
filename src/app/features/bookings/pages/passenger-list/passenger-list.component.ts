import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Passenger, Luggage } from '../../model/booking.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PassengerComponent } from '../passenger/passenger.component';
import { Router } from '@angular/router';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-passenger-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, PassengerComponent],
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.css']
})

export class PassengerListComponent {
  passengers: Passenger[] = [];
  bookingId: string = '';
  constructor(private router: Router, private bookingService: BookingService) {
    const state = this.router.getCurrentNavigation()?.extras.state as { bookingId: string, passengers?: Passenger[] };
    if (state) {
      this.bookingId = state.bookingId;
      if (state.passengers) {
        this.passengers = state.passengers;
      } else {
        this.loadBookingData();
      }
    }
  }

  async loadBookingData() {
    if (!this.bookingId) return;
    const booking = await this.bookingService.get(this.bookingId);
    if (booking) {
      this.passengers = booking.passengers;
    }
  }

  async saveLuggage() {
    for (const passenger of this.passengers) {
      if (passenger.luggage) {
        await this.bookingService.updatePassengerLuggage(this.bookingId, passenger.passportNumber, passenger.luggage);
      }
    }
    const booking = await this.bookingService.get(this.bookingId);
    this.router.navigate(['/confirm-booking'], { state: { booking } });  
  }

  updatePassengerLuggage(event: { bookingId: string, passportNumber: string, luggage: Luggage }) {
    const passenger = this.passengers.find(p => p.passportNumber === event.passportNumber);
    if (passenger) {
      passenger.luggage = event.luggage;
    }
  }
  
}
