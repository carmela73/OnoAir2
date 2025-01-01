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
  flight?: Flight;
  booking?: Booking;
  isViewMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private bookingService: BookingService
  ) {}
  
  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');

    if (bookingId) {
      this.isViewMode = true;
      this.booking = this.bookingService.get(bookingId);
      if (this.booking) {
        this.flight = this.flightService.get(this.booking.flightNumber);
      }
    } else if (flightNumber) {
      this.isViewMode = false;
      this.flight = this.flightService.get(flightNumber);
    }
  }
}