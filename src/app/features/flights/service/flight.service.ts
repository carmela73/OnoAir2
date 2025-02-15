import { Injectable,  } from '@angular/core';
import { Flight } from '../model/flight.model';
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
      .filter(flight => new Date(flight.boardingDate) > today); 
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
  
    // בדיקה שאין כבר טיסה עם מספר טיסה זהה
    const existingFlight = await this.get(flight.flightNumber);
    if (existingFlight) {
      throw new Error('A flight with this flight number already exists!');
    }
  
    // הוספת טיסה חדשה
    await addDoc(flightsCollection, flight);
  }
  
}