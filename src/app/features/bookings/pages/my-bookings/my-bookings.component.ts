import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { FlightService } from '../../../flights/service/flight.service';
import { Booking, BookingStatus } from '../../model/booking.model';
import { Flight } from '../../../flights/model/flight.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DestinationService } from '../../../destinations/service/destination.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelBookingDialogComponent } from '../cancel-booking-dialog/cancel-booking-dialog.component';
import { Timestamp } from '@firebase/firestore';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatDialogModule ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})

export class MyBookingsComponent implements OnInit {
  upcomingBookings: { booking: Booking; flight: Flight }[] = [];
  completedBookings: { booking: Booking; flight: Flight }[] = [];
  cancelledBookings: { booking: Booking; flight: Flight }[] = [];
  previousBookings: { booking: Booking; flight: Flight }[] = [];
  destinationImages: { [destination: string]: string } = {}; 
  now: Date = new Date();

  constructor(private bookingService: BookingService, private flightService: FlightService, private destinationService: DestinationService, private dialog: MatDialog ) {}

  async ngOnInit() {

  this.now = new Date();
  await this.loadBookings();
  const allBookings = await this.bookingService.list();
  const flights = await Promise.all(allBookings.map(b => this.flightService.get(b.flightNumber)));

  const destinationRequests = allBookings.map(async (booking: Booking, index: number) => {
    const flight = flights[index];

    // split bookings into upcoming and previous
      if (flight) {
      // destination image
      if (!this.destinationImages[flight.destination]) {
        const destination = await this.destinationService.getByName(flight.destination);
        this.destinationImages[flight.destination] = destination ? destination.imageUrl : 'assets/default-image.jpg';
      }
    }
  });

  await Promise.all(destinationRequests);
}
        

  hasUpcomingBookings(): boolean {
    return this.upcomingBookings.length > 0;
  }

  hasPreviousBookings(): boolean {
    return this.previousBookings.length > 0;
  }

  getDestinationImage(destination: string): string {
    return this.destinationImages[destination];
  }
  

  openCancelDialog(bookingId: string) {
    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '350px',
      data: { bookingId }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) { 
        await this.cancelBooking(bookingId);
      }
    });
  }
  
  async cancelBooking(bookingId: string) {
    const booking = await this.bookingService.cancelBooking(bookingId);
    if (!booking) {
        return;
    }

    const flight = await this.flightService.get(booking.flightNumber);
    if (!flight){
      return;
    }

    const flightDate = flight.boardingDate instanceof Timestamp ? flight.boardingDate.toDate() : new Date(flight.boardingDate);
    const now = new Date();

    this.upcomingBookings = this.upcomingBookings.filter(b => b.booking.bookingId !== bookingId);
      this.completedBookings = this.completedBookings.filter(b => b.booking.bookingId !== bookingId);
      this.cancelledBookings = this.cancelledBookings.filter(b => b.booking.bookingId !== bookingId);

      if (flightDate > now) {
          this.cancelledBookings.push({ booking, flight });
      } 
      else {
          this.completedBookings.push({ booking, flight });
      }
  }

  async loadBookings() {
    const allBookings = await this.bookingService.list();
    const flights = await Promise.all(allBookings.map(b => this.flightService.get(b.flightNumber)));
    const now = new Date();
  
    this.upcomingBookings = [];
    this.completedBookings = [];
    this.cancelledBookings = [];
  
    allBookings.forEach((booking, index) => {
      const flight = flights[index];
      if (flight) {
        const flightDate = flight.boardingDate instanceof Timestamp ? flight.boardingDate.toDate() : new Date(flight.boardingDate);

        if (flightDate < now && booking.status === BookingStatus.Active) {
          this.completedBookings.push({ booking, flight });
        } 
        else if (booking.status === BookingStatus.Cancelled) {
          this.cancelledBookings.push({ booking, flight });
        } 
        else if (flightDate > now && booking.status === BookingStatus.Active) {
          this.upcomingBookings.push({ booking, flight });
        }
      }
    });
  }  
  
  getBookingsByType(type: string) {
    if (type === 'Completed Flights') {
      return this.completedBookings;
    }
    if (type === 'Cancelled Flights') {
      return this.cancelledBookings;
    }
    return [];
  }  

}
