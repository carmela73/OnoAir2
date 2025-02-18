import { Injectable } from '@angular/core';
import { Booking, BookingStatus, Passenger } from '../model/booking.model';
import { Firestore, collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { bookingConverter } from '../booking-converter';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  constructor(private firestore: Firestore) {}

  async list(): Promise<Booking[]> {
    const bookingsCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    const querySnapshot = await getDocs(bookingsCollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async get(bookingId: string): Promise<Booking | undefined> {
  
    const bookingsCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    const q = query(bookingsCollection, where('bookingId', '==', bookingId));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return undefined;
    }
  
    const bookingData = querySnapshot.docs[0].data();
    return bookingData;
  }

  async addBooking(booking: Booking) {
    if (!booking.bookingId) {
      booking.bookingId = Booking.generateBookingId();
    }

    const bookingsCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    await addDoc(bookingsCollection, booking);
  }


  async updateBooking(booking: Booking): Promise<void> {
    if (!booking.id) {
      return;
    }
  
    const bookingRef = doc(this.firestore, 'bookings', booking.id).withConverter(bookingConverter);
  

      const docSnap = await getDoc(bookingRef);
  
      if (!docSnap.exists()) {
        return;
      }
    
      await updateDoc(bookingRef, {
        flightNumber: booking.flightNumber,
        passengers: booking.passengers.map(p => ({ name: p.name, passportNumber: p.passportNumber })),
        status: booking.status
      });
  }  
  
  async isPassportNumberUsed(passportNumber: string, currentBookingId?: string): Promise<boolean> {
  
    const bookingsSnapshot = await getDocs(collection(this.firestore, 'bookings'));
  
    for (const doc of bookingsSnapshot.docs) {
      const booking = doc.data() as Booking;
  
      if (currentBookingId && booking.bookingId === currentBookingId) {
        continue; 
      }
  
      if (booking.passengers.some(p => p.passportNumber === passportNumber)) {
        return true;
      }
    }
      return false;
  }
  
  async cancelBooking(bookingId: string): Promise<void> {
    const bookingRef = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
    await updateDoc(bookingRef, { status: BookingStatus.Cancelled });
  }
  
}