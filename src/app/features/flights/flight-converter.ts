import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Flight } from './model/flight.model';

export const flightConverter: FirestoreDataConverter<Flight> = {
  toFirestore(flight: Flight) {
    return {
      flightNumber: flight.flightNumber, 
      origin: flight.origin,
      destination: flight.destination,
      boardingDate: flight.boardingDate.toISOString(),
      arrivalDate: flight.arrivalDate.toISOString(),
      numberOfSeats: flight.numberOfSeats, 
      imageUrl: flight.imageUrl 
    };
  },
  
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Flight {
    const data = snapshot.data(options);
    return new Flight(
      data['flightNumber'],
      data['origin'],
      data['destination'],
      data['boardingDate'].toDate(),
      data['arrivalDate'].toDate(), 
      data['numberOfSeats'],
      data['imageUrl']
    );
  }
};
