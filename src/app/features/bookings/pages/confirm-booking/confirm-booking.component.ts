import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Booking, Luggage } from '../../model/booking.model';
import { LuggageComponent } from '../luggage/luggage.component';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LuggageComponent],
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})

export class ConfirmBookingComponent {
  booking: Booking | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private bookingService: BookingService) {
    const nav = this.router.getCurrentNavigation();
    this.booking = nav?.extras.state?.['booking'] || null;
  }

  confirmBooking() {
    if (!this.booking) return;
    this.bookingService.updateBooking(this.booking).then(() => {
    this.router.navigate(['/my-bookings']);
    });
  }
  
  cancelBooking() {
    if (!this.booking) return;  
    this.router.navigate(['/passenger-list'], { 
      state: { 
        bookingId: this.booking.bookingId,
        passengers: this.booking.passengers 
      } 
    });
  }
  
}
