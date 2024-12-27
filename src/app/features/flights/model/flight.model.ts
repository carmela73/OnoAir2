export class Flight {
    constructor(
      public flightNumber: string, //id
      public origin: string,
      public destination: string,
      public boardingDate: Date,
      public arrivalDate: Date,
      public numberOfSeats: number,
      public imageUrl: string
    ) {}
  }
  