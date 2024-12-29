import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { FlightService } from '../../../flights/service/flight.service';
import { Booking } from '../../model/booking.model';
import { Flight } from '../../../flights/model/flight.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterLink, MatButtonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})

export class MyBookingsComponent implements OnInit {
  upcomingBookings: { booking: Booking; flight: Flight }[] = [];
  previousBookings: { booking: Booking; flight: Flight }[] = [];

  constructor(private bookingService: BookingService, private flightService: FlightService) {}

  ngOnInit(): void {
    const now = new Date();

    const allBookings = this.bookingService.list();

    // split bookings into upcoming and previous
    allBookings.forEach((booking) => {
      const flight = this.flightService.get(booking.flightNumber);
      if (flight) {
        if (flight.boardingDate > now) {
          this.upcomingBookings.push({ booking, flight });
        } else {
          this.previousBookings.push({ booking, flight });
        }
      }
    });
  }

  hasUpcomingBookings(): boolean {
    return this.upcomingBookings.length > 0;
  }

  hasPreviousBookings(): boolean {
    return this.previousBookings.length > 0;
  }

}
