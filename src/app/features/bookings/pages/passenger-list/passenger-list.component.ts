import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Passenger, Luggage } from '../../model/booking.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PassengerComponent } from '../passenger/passenger.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../service/booking.service';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-passenger-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, PassengerComponent, MatStepperModule],
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.css']
})

export class PassengerListComponent implements OnInit {
  passengers: Passenger[] = [];
  bookingId: string = '';
  flightNumber: string = '';
  
  constructor(private route: ActivatedRoute, private router: Router, private bookingService: BookingService) {}
   
  ngOnInit() {   
    const state = this.router.getCurrentNavigation()?.extras.state as { 
      bookingId?: string, 
      flightNumber?: string, 
      passengers?: Passenger[] 
    } | undefined;
  
  this.route.paramMap.subscribe(params => {
    this.flightNumber = params.get('flightNumber') || this.bookingService.getSelectedFlight();
  });

    if (state?.bookingId) {
      this.bookingId = state.bookingId;
    }
    if (state?.passengers) {
      this.passengers = state.passengers;
      this.bookingService.setPassengers(this.passengers);
    } else {
      this.passengers = this.bookingService.getPassengers();
    }
    if (!this.bookingId) {
      this.bookingId = this.bookingService.getBookingId();
    }
    if (this.passengers.length === 0 && this.bookingId) {
      this.loadBookingData();
    }
  }   

  async loadBookingData() {
    if (!this.bookingId) return;
    const booking = await this.bookingService.get(this.bookingId);
    if (booking) {
      this.passengers = booking.passengers;
      this.flightNumber = booking.flightNumber;
      this.bookingService.setPassengers(this.passengers);
    }
  }

  async saveLuggage() {
    if (!this.bookingId) {
      return;
    }
    for (const passenger of this.passengers) {
      if (passenger.luggage) {
        await this.bookingService.updatePassengerLuggage(this.bookingId, passenger.passportNumber, passenger.luggage);
      }
    }
    this.bookingService.setPassengers(this.passengers); 
    this.router.navigate([`/confirm-booking/${this.bookingId}`]);
  }

  updatePassengerLuggage(event: { bookingId: string, passportNumber: string, luggage: Luggage }) {
    const passenger = this.passengers.find(p => p.passportNumber === event.passportNumber);
    if (passenger) {
      passenger.luggage = event.luggage;
    }
  }

  navigateToStep(step: number) {
    if (step === 0) {
      this.router.navigate([`/book/${this.flightNumber}`]);
    } else if (step === 1) {
      this.router.navigate([`/passenger-list/${this.flightNumber}`]);
    } else if (step === 2) {
      this.bookingService.setPassengers(this.passengers);
      this.router.navigate([`/confirm-booking/${this.bookingId}`]);
    }

}
}