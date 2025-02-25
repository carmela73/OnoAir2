export enum BookingStatus {
  Active = 'Active',
  Cancelled = 'Cancelled'
}

export class Booking {
    constructor(
      public id: string, //firebase id
      public bookingId: string = Booking.generateBookingId(),       
      public flightNumber: string,     
      public passengers: Passenger[],
      public status: BookingStatus =  BookingStatus.Active // default value
    ) {}
  
    get numberOfPassengers(): number {
      return this.passengers.length;
    }

    static generateBookingId(): string {
      return Math.random().toString(36).slice(2,6).toUpperCase(); 
    }
  }

  export class Luggage {
    constructor(
      public cabin: number = 0,    
      public checked: number = 0,  
      public heavy: number = 0    
    ) {}
  } 
  
  export class Passenger {
    constructor(
      public name: string,            
      public passportNumber: string,
      public luggage?: Luggage 
    ) {}
  }
  