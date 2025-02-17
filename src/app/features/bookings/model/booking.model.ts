export enum BookingStatus {
  Active = 'Active',
  Cancelled = 'Cancelled'
}

export class Booking {
    constructor(
      public id: string, //firebase id
      public bookingId: string,       
      public flightNumber: string,     
      public passengers: Passenger[],
      public status: BookingStatus =  BookingStatus.Active // default value
    ) {}
  
    get numberOfPassengers(): number {
      return this.passengers.length;
    }
  }
  
  export class Passenger {
    constructor(
      public name: string,            
      public passportNumber: string  
    ) {}
  }
  