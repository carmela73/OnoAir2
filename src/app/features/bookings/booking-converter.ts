import { FirestoreDataConverter } from '@angular/fire/firestore';
import { Booking, Passenger, BookingStatus, Luggage } from './model/booking.model';

export const bookingConverter: FirestoreDataConverter<Booking> = {
  toFirestore(booking: Booking) {
    return {
      bookingId: booking.bookingId,
      flightNumber: booking.flightNumber,
      passengers: booking.passengers.map(p => {
        const passengerData: any = {
            name: p.name,
            passportNumber: p.passportNumber
        };
        if (p.luggage) {
            passengerData.luggage = {
                cabin: p.luggage.cabin ?? null,
                checked: p.luggage.checked ?? null,
                heavy: p.luggage.heavy ?? null
            };
        }
        return passengerData;
    }), 
        status: booking.status
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Booking(
      snapshot.id,
      data['bookingId'] as string,
      data['flightNumber'] as string,
      data['passengers'].map((p: { name: string; passportNumber: string, luggage?: Luggage }) => 
        new Passenger(
          p['name'], 
          p['passportNumber'],
          p.luggage
          ? new Luggage(
              p.luggage.cabin ?? undefined,
              p.luggage.checked ?? undefined,
              p.luggage.heavy ?? undefined
            )
          : undefined
        )
      ),
      data['status'] as BookingStatus
    );
  }
};
