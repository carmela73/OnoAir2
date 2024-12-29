export class Booking {
    constructor(
      public bookingId: string,       // id
      public flightNumber: string,     
      public passengers: Passenger[] 
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
  