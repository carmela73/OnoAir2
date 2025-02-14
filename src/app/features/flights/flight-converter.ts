import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Flight, FlightStatus } from './model/flight.model';

export const flightConverter: FirestoreDataConverter<Flight> = {
  toFirestore(flight: Flight) {
    return {
      flightNumber: flight.flightNumber, 
      origin: flight.origin,
      destination: flight.destination,
      boardingDate: flight.boardingDate.toISOString(),
      arrivalDate: flight.arrivalDate.toISOString(),
      numberOfSeats: flight.numberOfSeats, 
      imageUrl: flight.imageUrl,
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
      data['boardingDate'].toDate() as Date,
      data['arrivalDate'].toDate() as Date, 
      data['numberOfSeats'],
      data['imageUrl'],
      data['status'] as FlightStatus
    );
  }
};
