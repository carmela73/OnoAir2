import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../bookings/service/booking.service';
import { Booking } from '../../../bookings/model/booking.model';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css']
})

export class BookFlightComponent implements OnInit {
  flight: Flight | null = null;
  booking: Booking | null = null;
  mode: 'book' | 'view' = 'book';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private bookingService: BookingService
  ) {}
  
  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
  
    if (this.mode === 'view') {
      const bookingId = this.route.snapshot.paramMap.get('bookingId');
  
      if (bookingId) {
        this.booking = this.bookingService.get(bookingId) || null;
  
        if (this.booking) {
          this.flight = this.flightService.get(this.booking.flightNumber) || null;
        }
      }
    }
  
    if (this.mode === 'book') {
      const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
  
      if (flightNumber) {
        this.flight = this.flightService.get(flightNumber) || null;
      }
    }
  }
}
