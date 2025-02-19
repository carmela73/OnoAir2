import { Injectable } from '@angular/core';
import { Destination, DestinationStatus  } from '../model/destination.model';
import { Firestore, collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { destinationConverter } from '../destination-converter';
import { FlightStatus, Flight } from '../../flights/model/flight.model';
import { flightConverter } from '../../flights/flight-converter';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  constructor(private firestore: Firestore) {}

  async list(): Promise<Destination[]> {
    const destinationsCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const querySnapshot = await getDocs(destinationsCollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async getByCode(code: string): Promise<Destination | undefined> {
    const destinationsCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const q = query(destinationsCollection, where('code', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return undefined;
  }

  async getByName(name: string): Promise<Destination | undefined> {
    const destinationsCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const q = query(destinationsCollection, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return undefined;
  }

  async addDestination(destination: Destination): Promise<void> {
    const destinationsCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
  
    const existingDestination = await this.getByCode(destination.code);
    if (existingDestination) {
      throw new Error('A destination with this code already exists!');
    }
  
    await addDoc(destinationsCollection, destination);
  }  

  async updateDestination(destination: Destination): Promise<void> {
    if (!destination.id) {
      return;
    }
    const destinationRef = doc(this.firestore, 'destinations', destination.id).withConverter(destinationConverter);
    await updateDoc(destinationRef, { 
      name: destination.name,
      airportName: destination.airportName,
      website: destination.website,
      imageUrl: destination.imageUrl,
      email: destination.email,
      status: destination.status
    });
  }  

  async deleteDestination(id: string): Promise<void> {
    const destinationRef = doc(this.firestore, 'destinations', id);
    await deleteDoc(destinationRef);
  }

  async cancelDestination(destinationCode: string): Promise<boolean> {
    const destination = await this.getByCode(destinationCode);
    if (!destination) return false;
  
    const hasFlights = await this.hasActiveFlights(destinationCode);
    if (hasFlights) {
      return false;
    }
  
    destination.status = DestinationStatus.Cancelled;
    await this.updateDestination(destination);
    return true;
  }
  

  async hasActiveFlights(destinationCode: string): Promise<boolean> {
    const destination = await this.getByCode(destinationCode);
    if (!destination) return false;
  
    const flightsCollection = collection(this.firestore, 'flights').withConverter(flightConverter);
    const q = query(
      flightsCollection, 
      where('destination', '==', destination.name), 
      where('status', '==', FlightStatus.Active)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  }

  async updateDestinationStatus(destinationCode: string, status: 'Active' | 'Cancelled') {
    const destinationsRef = collection(this.firestore, 'destinations');
    const q = query(destinationsRef, where('code', '==', destinationCode));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error(`No destination found in Firestore with code: ${destinationCode}`);
      return;
    }
  
    const destinationDoc = querySnapshot.docs[0];
    const destinationId = destinationDoc.id;
  
    await updateDoc(doc(this.firestore, 'destinations', destinationId), { status });
  }  
  

}