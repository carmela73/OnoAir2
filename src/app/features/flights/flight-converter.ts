import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';
import { Flight, FlightStatus } from './model/flight.model';

export const flightConverter: FirestoreDataConverter<Flight> = {
  toFirestore(flight: Flight) {
    return {
      flightNumber: flight.flightNumber, 
      origin: flight.origin,
      destination: flight.destination,
      boardingDate: flight.boardingDate instanceof Date ? Timestamp.fromDate(flight.boardingDate) : flight.boardingDate,
      arrivalDate: flight.arrivalDate instanceof Date ? Timestamp.fromDate(flight.arrivalDate) : flight.arrivalDate,
      numberOfSeats: flight.numberOfSeats, 
      status: flight.status
    };
  },
  
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Flight {
    const data = snapshot.data(options);
    return new Flight(
      snapshot.id,
      data['flightNumber'],
      data['origin'],
      data['destination'],
      data['boardingDate'] instanceof Timestamp ? data['boardingDate'].toDate() : new Date(data['boardingDate']),
      data['arrivalDate'] instanceof Timestamp ? data['arrivalDate'].toDate() : new Date(data['arrivalDate']),
      data['numberOfSeats'],
      data['status'] as FlightStatus
    );
  }
};
