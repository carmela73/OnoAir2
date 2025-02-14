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
  
}