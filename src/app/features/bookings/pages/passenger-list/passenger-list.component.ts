import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Passenger, Luggage } from '../../model/booking.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PassengerComponent } from '../passenger/passenger.component';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state as { bookingId: string, passengers: Passenger[] };
    if (state) {
      this.bookingId = state.bookingId;
      this.passengers = state.passengers;
    }
  }

  saveLuggage() {
    this.router.navigate(['/my-bookings']);
  }

}
