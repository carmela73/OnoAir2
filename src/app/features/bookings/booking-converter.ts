import { FirestoreDataConverter } from '@angular/fire/firestore';
import { Booking, Passenger, BookingStatus } from './model/booking.model';

export const bookingConverter: FirestoreDataConverter<Booking> = {
  toFirestore(booking: Booking) {
    return {
      bookingId: booking.bookingId,
      flightNumber: booking.flightNumber,
      passengers: booking.passengers.map(p => ({name: p.name, passportNumber: p.passportNumber})),
      status: booking.status
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Booking(
      snapshot.id,
      data['bookingId'] as string,
      data['flightNumber'] as string,
      data['passengers'].map((p: { name: string; passportNumber: string }) => new Passenger(p['name'], p['passportNumber'])),
      data['status'] as BookingStatus
    );
  }
};
