import { Injectable } from '@angular/core';
import { Booking } from '../model/booking.model';
import { Passenger } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [];

  constructor() {
    this.initializeBookings();
  }

  private initializeBookings(): void {
    this.bookings = [
      new Booking('B001', 'W61282', [new Passenger('Hava Babay-Adi', '123456789'), new Passenger('John Doe', '987654321')]),
      new Booking('B002', 'LX8396', [new Passenger('Jane Smith', '987654321'), new Passenger('Alice Brown', '123123123')]),
      new Booking('B003', 'AF3056', [new Passenger('Bob Johnson', '321654987')]),
      new Booking('B004', 'BA2189', [new Passenger('David Clark', '456789123'), new Passenger('Eve Adams', '789123456')]),
      new Booking('B005', 'LH7890', [new Passenger('Frank Martin', '654321987')]),
      new Booking('B006', 'KL4510', [new Passenger('Grace Lee', '741852963'), new Passenger('Henry Young', '852963741')]),
      new Booking('B007', 'AZ1198', [new Passenger('Ivy Green', '963852741')]),
      new Booking('B008', 'OA3001', [new Passenger('Jack Hill', '159357486'), new Passenger('Kelly Wright', '357159246'), new Passenger('Leo Black', '753159258')]),
      new Booking('B009', 'OS9003', [new Passenger('Mona White', '258159357'), new Passenger('Nick Silver', '951753486')]),
      new Booking('B010', 'AC5638', [new Passenger('Olivia Gold', '123987456')])
    ];
  }

  list(): Booking[] {
    return this.bookings;
  }

  get(bookingId: string): Booking | undefined {
    return this.bookings.find(booking => booking.bookingId === bookingId);
  }
  
}
