import { Injectable } from '@angular/core';
import { Booking, BookingStatus, Passenger, Luggage } from '../model/booking.model';
import { Firestore, collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { bookingConverter } from '../booking-converter';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private passengers: Passenger[] = [];
  private luggageDetails: Luggage[] = [];
  private selectedFlightNumber: string | null = null;
  private selectedPassengers: Passenger[] = [];
  private currentBookingId: string | null = null;

  constructor(private firestore: Firestore) {}

  setBookingId(bookingId: string) {
    this.currentBookingId = bookingId;
  }
  
  getBookingId(): string {
    return this.currentBookingId ?? '';
  }

  setSelectedFlight(flightNumber: string) {
      this.selectedFlightNumber = flightNumber;
  }
  
  getSelectedFlight(): string {
      return this.selectedFlightNumber ?? '';
  }
  
  setPassengers(passengers: Passenger[]) {
      this.selectedPassengers = passengers;
  }
  
  getPassengers(): Passenger[] {
      return this.selectedPassengers;
  }
  
  setLuggage(luggage: Luggage[]) {
      this.luggageDetails = luggage;
  }
  
  getLuggage(): Luggage[] {
      return this.luggageDetails;
  }

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
    this.setBookingId(booking.bookingId);
    const bookingsCollection = collection(this.firestore, 'bookings').withConverter(bookingConverter);
    await addDoc(bookingsCollection, booking);
    this.clearBookingData();
  }

  clearBookingData() {
    this.passengers = [];
    this.luggageDetails = [];
  }

  resetData() {
    this.selectedFlightNumber = null;
    this.selectedPassengers = [];
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
      passengers: booking.passengers.map(p => ({
        name: p.name, 
        passportNumber: p.passportNumber,
        luggage: p.luggage ? { 
          cabin: Array.isArray(p.luggage.cabin) ? p.luggage.cabin.map(w => Number(w)) : [], 
          checked: Array.isArray(p.luggage.checked) ? p.luggage.checked.map(w => Number(w)) : [], 
          heavy: Array.isArray(p.luggage.heavy) ? p.luggage.heavy.map(w => Number(w)) : [] 
        } : null
      })),
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
  
  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const bookingSnapshot = await getDocs(query(collection(this.firestore, 'bookings').withConverter(bookingConverter), where('bookingId', '==', bookingId)));
    if (bookingSnapshot.empty) {
        return null;
    }
    const docRef = bookingSnapshot.docs[0].ref;
    const updatedBooking = bookingSnapshot.docs[0].data();
    updatedBooking.status = BookingStatus.Cancelled;
    await updateDoc(docRef, { status: BookingStatus.Cancelled });
    return updatedBooking;
  }

  async hasActiveBookings(flightNumber: string): Promise<boolean> {
    const bookings = await this.list();
    return bookings.some(booking => booking.flightNumber === flightNumber && booking.status === 'Active');
  }

  async updatePassengerLuggage(bookingId: string, passportNumber: string, luggage: Luggage): Promise<void> {
    const booking = await this.get(bookingId);
    if (!booking) return;
    const passenger = booking.passengers.find(p => p.passportNumber === passportNumber);
    if (!passenger) return;
    passenger.luggage = luggage;
    await this.updateBooking(booking);
    this.selectedPassengers = this.selectedPassengers.map(p =>
      p.passportNumber === passportNumber ? { ...p, luggage } : p
    );
    this.setPassengers(this.selectedPassengers);
}

}