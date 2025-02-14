export enum FlightStatus {
  Active = 'Active',
  Cancelled = 'Cancelled'
}

export class Flight {
    constructor(
      public id: string, // firestore id
      public flightNumber: string, 
      public origin: string,
      public destination: string,
      public boardingDate: Date,
      public arrivalDate: Date,
      public numberOfSeats: number,
      public imageUrl: string,
      public status: FlightStatus = FlightStatus.Active // default value
    ) {}
  }
  