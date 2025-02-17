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
    const bookingRef = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
    const bookingSnap = await getDoc(bookingRef);
    return bookingSnap.exists() ? bookingSnap.data() : undefined;
  }

  async addBooking(booking: Booking): Promise<void> {
    const bookingsCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    await addDoc(bookingsCollection, booking);
  }

  async updateBooking(booking: Booking): Promise<void> {
    const bookingRef = doc(this.firestore, 'bookings', booking.bookingId).withConverter(bookingConverter);
    await updateDoc(bookingRef, {
      flightNumber: booking.flightNumber,
      passengers: booking.passengers.map(p => ({ name: p.name, passportNumber: p.passportNumber })),
      status: booking.status
    });
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const bookingRef = doc(this.firestore, 'bookings', bookingId).withConverter(bookingConverter);
    await updateDoc(bookingRef, { status: BookingStatus.Cancelled });
  }
  
}