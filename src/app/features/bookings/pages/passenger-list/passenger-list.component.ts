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
    const state = this.router.getCurrentNavigation()?.extras.state as { bookingId: string, passengers: Passenger[] };
    if (state) {
      this.bookingId = state.bookingId;
      this.passengers = state.passengers;
    }
  }

  async saveLuggage() {
    for (const passenger of this.passengers) {
      if (passenger.luggage) {
        await this.bookingService.updatePassengerLuggage(this.bookingId, passenger.passportNumber, passenger.luggage);
      }
    }
  
    console.log('Luggage saved! Reloading bookings...');
    await this.bookingService.get(this.bookingId);
    this.router.navigate(['/my-bookings']);  
  }

  updatePassengerLuggage(event: { bookingId: string, passportNumber: string, luggage: Luggage }) {
    const passenger = this.passengers.find(p => p.passportNumber === event.passportNumber);
    if (passenger) {
      passenger.luggage = event.luggage;
    }
  }
  
}
