import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../bookings/service/booking.service';
import { Booking, Passenger, BookingStatus } from '../../../bookings/model/booking.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css']
})

export class BookFlightComponent implements OnInit {
  @Input() flightNumber?: string; 
  @Input() bookingId?: string;

  flight: Flight | null = null;
  booking: Booking | null = null;
  passengers: Passenger[] = [];
  numberOfPassengers : number | null = null;
  isFormInvalid: boolean = true;
  showSuccessMessage = false;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private bookingService: BookingService,
    private router: Router,
  ) {}
  
  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.bookingId = this.bookingId || params.get('bookingId') || undefined;
      this.flightNumber = this.flightNumber || params.get('flightNumber') || undefined;  
  
      if (this.bookingId) {
        const bookingData = await this.bookingService.get(this.bookingId);
  
        if (bookingData) {
          this.booking = bookingData;
          this.passengers = bookingData.passengers;
          this.flight = await this.flightService.get(this.booking.flightNumber) || null;
          this.numberOfPassengers = this.booking.passengers.length;
        }
      } else if (this.flightNumber) {
        const flightData = await this.flightService.get(this.flightNumber);
  
        if (flightData) {
          this.flight = flightData;
          this.passengers = [];
          this.booking = null;
          this.numberOfPassengers = null;
        }
      }
      await this.validateBookingForm(); 
    });
  }  
  
  updatePassengers() {
    let maxSeats = this.flight?.numberOfSeats || 1;
    let count = Math.min(Number(this.numberOfPassengers), maxSeats); // הגבלת מספר הנוסעים
  
    if (!count || count < 1) {
      this.passengers = [];
      return;
    }
    if (!this.passengers) {
      this.passengers = [];
    }
    while (this.passengers.length < count) {
      this.passengers.push(new Passenger('', ''));
    }
    if (this.passengers.length > count) {
      this.passengers = this.passengers.slice(0, count);
    }
    this.validateBookingForm();
  }
  
  async saveBooking() {
    if (!this.flight || this.passengers.some(p => !p.name || !p.passportNumber)) return;

    if (this.isFormInvalid) {
      alert("Cannot save booking: Invalid input or duplicate passport detected.");
      return;
    }
    
    for (const passenger of this.passengers) {
      if (await this.bookingService.isPassportNumberUsed(passenger.passportNumber, this.booking?.bookingId)) {
        alert(`Passport number ${passenger.passportNumber} is already used in the system.`);
        return;
      }
    }

    const bookingId = this.booking?.bookingId || Booking.generateBookingId();
    const id = this.booking?.id || bookingId;

    const updatedBooking = new Booking(
      id,
      bookingId,
      this.flight.flightNumber,
      [...this.passengers],
      BookingStatus.Active
    );

      if (this.booking) {
        await this.bookingService.updateBooking(updatedBooking);
      } else {
        await this.bookingService.addBooking(updatedBooking);
      }
  
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.router.navigate(['/my-bookings']);
      }, 3000);
  } 
  
  async validateBookingForm(): Promise<void> {
    this.isFormInvalid = true;
  
    const nameRegex = /^[A-Za-z ]+$/;
    const passportRegex = /^[0-9]{9}$/;
  
    if (!this.flight || !this.numberOfPassengers || this.numberOfPassengers < 1 || !this.passengers.length) {
      return;
    }
  
    const seenPassports = new Set();
  
    for (const passenger of this.passengers) {
      if (!passenger.name?.trim() || !nameRegex.test(passenger.name) ||
          passenger.name.length < 2 || 
          !passenger.passportNumber?.trim() || !passportRegex.test(passenger.passportNumber)) {
        return;
      }
  
      if (seenPassports.has(passenger.passportNumber)) {
        return;
      }
      seenPassports.add(passenger.passportNumber);
    }
      this.isFormInvalid = false;
  }
  
}