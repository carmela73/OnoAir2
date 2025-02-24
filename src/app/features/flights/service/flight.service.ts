import { Injectable } from '@angular/core';
import { Flight, FlightStatus } from '../model/flight.model';
import { Firestore, collection, collectionData, addDoc, doc, getDocs, getDoc, updateDoc, deleteDoc, query, where, orderBy, endAt} from '@angular/fire/firestore';
import { flightConverter } from '../flight-converter';
import { Timestamp } from '@angular/fire/firestore';


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
    const now = new Date();
    
    return querySnapshot.docs
      .map(doc => doc.data())
      .filter(flight => {
        const flightDateTime = flight.boardingDate instanceof Timestamp ? flight.boardingDate.toDate() : new Date(flight.boardingDate);
        return flightDateTime > now && flight.status === 'Active'; 
      });
  }


  async updateFlight(flight: Flight): Promise<void> {
    if (!flight.id) {
      return;
    }
    const flightRef = doc(this.firestore, 'flights', flight.id).withConverter(flightConverter);
    
    await updateDoc(flightRef, { 
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      boardingDate: Timestamp.fromDate(flight.boardingDate),
      arrivalDate: Timestamp.fromDate(flight.arrivalDate),
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

  async get(flightNumber: string): Promise<Flight | undefined> {
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const q = query(flightsCollection, where('flightNumber', '==', flightNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    } else {
        return undefined;
    }
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
    const flightData = flightDoc.data() as Flight;

    const now = new Date();
    const flightDate = flightData.boardingDate instanceof Timestamp ? flightData.boardingDate.toDate() : new Date(flightData.boardingDate);

    if (flightData.status === 'Cancelled' && status === 'Cancelled') {
      console.log(`Flight ${flightNumber} is already cancelled.`);
      return;
    }

    if (flightDate < now && status === 'Active') {
      throw new Error('Cannot activate a flight that has already occurred.');
    }
  
    await updateDoc(doc(this.firestore, 'flights', flightId), { status });
  } 

  async updateAllPastFlights() {
    const flights = await this.list(); 
    const now = new Date();
  
    for (const flight of flights) {
      const flightDate = flight.boardingDate instanceof Timestamp ? flight.boardingDate.toDate() : new Date(flight.boardingDate);
  
      if (flightDate < now && flight.status !== 'Cancelled') {
        await this.updateFlightStatus(flight.flightNumber, 'Cancelled');
      }
    }
  }

  async getFlightsByDateRange(startDate: Date, endDate: Date, flexible?: boolean): Promise<Flight[]> {
    const now = new Date();
    now.setSeconds(0, 0); 

    const startTimestamp = Timestamp.fromDate(startDate);
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    const endTimestamp = Timestamp.fromDate(adjustedEndDate);

    let flightQuery = query(
      collection(this.firestore, 'flights').withConverter(flightConverter),
      orderBy('boardingDate'),
      where('boardingDate', '>', startTimestamp),
      where('boardingDate', '<=', endTimestamp)
  );
    const flightsSnapshot = await getDocs(flightQuery);
    const flights = flightsSnapshot.docs
        .map(doc => doc.data())
        .filter(flight => {
          const flightDateTime = flight.boardingDate instanceof Timestamp ? flight.boardingDate.toDate() : new Date(flight.boardingDate);
          return flightDateTime > now && flight.status === 'Active';
      });
    return flights;
  }

}