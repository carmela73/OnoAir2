import { Injectable } from '@angular/core';
import { Flight, FlightStatus } from '../model/flight.model';
import { Firestore, collection, collectionData, addDoc, doc, getDocs, getDoc, updateDoc, deleteDoc, query, where} from '@angular/fire/firestore';
import { flightConverter } from '../flight-converter';

@Injectable({
  providedIn: 'root'
})

export class FlightService {
  constructor(private firestore: Firestore) {}

  async list(): Promise<Flight[]> {
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const querySnapshot = await getDocs(flightsCollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async listFutureFlights(): Promise<Flight[]> {
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const querySnapshot = await getDocs(flightsCollection);
    const today = new Date();
    
    return querySnapshot.docs
      .map(doc => doc.data())
      .filter(flight => new Date(flight.boardingDate) > today && flight.status === 'Active'); 
  }

  async get(flightNumber: string): Promise<Flight | undefined> {  
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const q = query(flightsCollection, where('flightNumber', '==', flightNumber));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const flight = querySnapshot.docs[0].data();
      return flight;
    }
    return undefined;
  }

  async updateFlight(flight: Flight): Promise<void> {
    if (!flight.id) {
      return;
    }
    const flightRef = doc(this.firestore, 'flights', flight.id).withConverter(flightConverter);

    const boardingDate = typeof flight.boardingDate === 'string' ? new Date(flight.boardingDate) : flight.boardingDate;
    const arrivalDate = typeof flight.arrivalDate === 'string' ? new Date(flight.arrivalDate) : flight.arrivalDate;  
  
    await updateDoc(flightRef, { 
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      boardingDate: flight.boardingDate.toISOString(),
      arrivalDate: flight.arrivalDate.toISOString(),
      numberOfSeats: flight.numberOfSeats,
      status: flight.status
    });
  }
  
  async addFlight(flight: Flight): Promise<void> {
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
  
    const existingFlight = await this.get(flight.flightNumber);
    if (existingFlight) {
      throw new Error('A flight with this flight number already exists!');
    }
      await addDoc(flightsCollection, flight);
  }

  async cancelFlight(flightNumber: string): Promise<void> {
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const q = query(flightsCollection, where('flightNumber', '==', flightNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const flightDoc = querySnapshot.docs[0];
      const flightRef = doc(this.firestore, 'flights', flightDoc.id).withConverter(flightConverter);
      
      await updateDoc(flightRef, { status: FlightStatus.Cancelled });
    }
  }

  async updateFlightStatus(flightNumber: string, status: 'Active' | 'Cancelled') {
    const flightsRef = collection(this.firestore, 'flights');
    const q = query(flightsRef, where('flightNumber', '==', flightNumber));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return;
    }
  
    const flightDoc = querySnapshot.docs[0];
    const flightId = flightDoc.id;
  
    await updateDoc(doc(this.firestore, 'flights', flightId), { status });
  
    console.log(`Flight ${flightNumber} (Firestore ID: ${flightId}) updated to ${status}`);
  }  

}