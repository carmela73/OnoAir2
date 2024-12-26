import { Injectable } from '@angular/core';
import { Flight } from '../model/flight.model';

@Injectable({
  providedIn: 'root'
})

export class FlightService {
  private flights: Flight[] = [];

  constructor() {
    this.generateDynamicDates(); // עדכון תאריכים דינאמיים
  }

  // טיסות סטטיות עם מקורות מגוונים
  private staticFlights: Omit<Flight, 'boardingDate' | 'arrivalDate'>[] = [
    { flightNumber: "W61283", origin: "Tel Aviv", destination: "Krakow", numberOfSeats: 200, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2023/09/krakow-rynek-glowwny-806x463-shutterstock_1341413513.jpg"},
    { flightNumber: "LX8396", origin: "Zurich", destination: "Frankfurt", numberOfSeats: 150, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_145475239.jpg"},
    { flightNumber: "BA2189", origin: "London", destination: "Tel Aviv", numberOfSeats: 180, imageUrl: "https://www.zmantelaviv.com/wp-content/uploads/2023/09/2.jpg"},
    { flightNumber: "LH7890", origin: "Berlin", destination: "Vienna", numberOfSeats: 170, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2017/05/shutterstock_238923085-1.jpg"},
    { flightNumber: "AF3056", origin: "Paris", destination: "Rome", numberOfSeats: 190, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_147643964.jpg"},
    { flightNumber: "IB2045", origin: "Madrid", destination: "Barcelona", numberOfSeats: 160, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_229604983.jpg"},
    { flightNumber: "KL4510", origin: "Amsterdam", destination: "Athens", numberOfSeats: 200, imageUrl: "https://www.elal.com/magazine/wp-content/uploads/2018/07/shutterstock_776615074.jpg"},
    { flightNumber: "AZ1198", origin: "Rome", destination: "Zurich", numberOfSeats: 210, imageUrl: "https://www.easygo.co.il/clients/easygo/gallery/Zurich/zuirch-1-756.jpg"},
    { flightNumber: "OA3001", origin: "Athens", destination: "London", numberOfSeats: 140, imageUrl: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRj8g2WGx2WKl5DjBWBUSrjKrxZ9s4_PGHPlZJi7Cth748HVkEG6BvXcPFQ7uyLUJfGmlKic1YO_LCZ7jepcZH2C5bUFSt2cpHY0uEIjA"},
    { flightNumber: "OS9003", origin: "Vienna", destination: "Tokyo", numberOfSeats: 180, imageUrl: "https://blog.easygo.co.il/wp-content/uploads/2019/09/tokyo2.jpg"}
  ];

  // מתודה ליצירת תאריכים דינאמיים
  private generateDynamicDates(): void {
    const now = new Date();
    this.flights = this.staticFlights.map((flight, index) => {
      const boardingDate = new Date(now);
      boardingDate.setDate(now.getDate() + index * 2); // תאריך המראה דינאמי

      const arrivalDate = new Date(boardingDate);
      arrivalDate.setHours(boardingDate.getHours() + 3); // משך טיסה: 3 שעות

      return { ...flight, boardingDate, arrivalDate };
    });
  }

  // מתודת החזרת רשימת כל הטיסות
  list(): Flight[] {
    return this.flights; // עותק של המערך
  }

  // מתודת מציאת טיסה לפי מספר טיסה
  get(flightNumber: string): Flight | undefined {
    return this.flights.find(flight => flight.flightNumber === flightNumber);
  }
}
