export enum DestinationStatus {
  Active = 'Active',
  Cancelled = 'Cancelled'
}

export class Destination {
    constructor(
      public id: string,  // firestore id
      public code: string, 
      public name: string,
      public airportName: string,
      public website: string,
      public imageUrl: string,
      public email: string,
      public status: DestinationStatus = DestinationStatus.Active // default value
    ) {}
  }
  