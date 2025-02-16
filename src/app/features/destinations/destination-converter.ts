import { FirestoreDataConverter } from '@angular/fire/firestore';
import { Destination, DestinationStatus } from './model/destination.model';

export const destinationConverter: FirestoreDataConverter<Destination> = {
  toFirestore(destination: Destination) {
    return {
      code: destination.code,
      name: destination.name,
      airportName: destination.airportName,
      website: destination.website,
      imageUrl: destination.imageUrl,
      email: destination.email,
      status: destination.status
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Destination(
      snapshot.id,
      data['code'],
      data['name'],
      data['airportName'],
      data['website'],
      data['imageUrl'],
      data['email'],
      data['status'] as DestinationStatus
    );
  }
};
