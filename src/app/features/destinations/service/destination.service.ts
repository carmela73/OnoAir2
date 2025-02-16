import { Injectable } from '@angular/core';
import { Destination, DestinationStatus  } from '../model/destination.model';
import { Firestore, collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { destinationConverter } from '../destination-converter';

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
      code: destination.code,
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

  async cancelDestination(code: string): Promise<void> {
    const destinationsCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const q = query(destinationsCollection, where('code', '==', code));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const destinationDoc = querySnapshot.docs[0];
      const destinationRef = doc(this.firestore, 'destinations', destinationDoc.id).withConverter(destinationConverter);
      
      await updateDoc(destinationRef, { status: DestinationStatus.Cancelled });
    }
  }  
  
}