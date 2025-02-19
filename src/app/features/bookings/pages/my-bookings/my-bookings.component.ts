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

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterLink, MatButtonModule, MatDialogModule ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})

export class MyBookingsComponent implements OnInit {
  upcomingBookings: { booking: Booking; flight: Flight }[] = [];
  previousBookings: { booking: Booking; flight: Flight }[] = [];
  destinationImages: { [destination: string]: string } = {}; 
  now: Date = new Date();

  constructor(private bookingService: BookingService, private flightService: FlightService, private destinationService: DestinationService, private dialog: MatDialog ) {}

  async ngOnInit() {

    this.now = new Date();

    const allBookings = await this.bookingService.list();
    // מביאים את כל פרטי הטיסות במקביל במקום בתוך לולאה
  const flights = await Promise.all(allBookings.map(b => this.flightService.get(b.flightNumber)));

  this.upcomingBookings = [];
  this.previousBookings = [];

  const destinationRequests = allBookings.map(async (booking: Booking, index: number) => {
    const flight = flights[index];

    // split bookings into upcoming and previous
      if (flight) {
        if (new Date(flight.boardingDate) > this.now && booking.status === BookingStatus.Active){
          this.upcomingBookings.push({ booking, flight });
        } else {
          this.previousBookings.push({ booking, flight });
        }

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
    return this.destinationImages[destination] || 'assets/default-image.jpg';
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
    const cancelledBooking = await this.bookingService.cancelBooking(bookingId);

    if (!cancelledBooking) {
        console.error(`Failed to cancel booking ${bookingId}`);
        return;
    }

    const index = this.upcomingBookings.findIndex(b => b.booking.bookingId === bookingId);
    if (index !== -1) {
        const cancelledItem = this.upcomingBookings.splice(index, 1)[0];
        cancelledItem.booking.status = BookingStatus.Cancelled;
        this.previousBookings.push(cancelledItem);
    }
  }

}
