import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Booking, Luggage, Passenger } from '../../model/booking.model';
import { LuggageComponent } from '../luggage/luggage.component';
import { BookingService } from '../../service/booking.service';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LuggageComponent, MatStepperModule],
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})

export class ConfirmBookingComponent {
  bookingId: string = '';
  flightNumber: string = '';
  passengers: Passenger[] = [];
  booking: Booking | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private bookingService: BookingService) {}
  
  async ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
  
    if (!this.bookingId) {
      return;
    }
  
    this.booking = await this.bookingService.get(this.bookingId) || null;
  
    if (this.booking) {
      this.flightNumber = this.booking.flightNumber;
      this.passengers = this.booking.passengers.map(p => ({
        ...p,
        luggage: p.luggage || this.bookingService.getPassengers().find(pass => pass.passportNumber === p.passportNumber)?.luggage || { cabin: [], checked: [], heavy: [] }
      }));
    } 
  }
   
  confirmBooking() {
    if (!this.booking) return;
    this.bookingService.updateBooking(this.booking).then(() => {
    this.router.navigate(['/my-bookings']);
    });
  }
  
  cancelBooking() {
    if (!this.booking) return;  
    this.router.navigate([`/passenger-list/${this.flightNumber}`]);
  }

  navigateToStep(step: number) {
    if (step === 0) {
      this.router.navigate([`/book/${this.flightNumber}`]);
    } else if (step === 1) {
      this.router.navigate([`/passenger-list/${this.flightNumber}`]);
    } else if (step === 2) {
      this.router.navigate([`/confirm-booking/${this.bookingId}`]);
    }
  }

}
