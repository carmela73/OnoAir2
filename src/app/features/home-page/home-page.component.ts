import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightsTableComponent } from '../flights/pages/flights-table/flights-table.component';
import { Flight } from '../flights/model/flight.model'; // Adjust the import path as necessary
import { FlightService } from '../flights/service/flight.service'; // ודאי שהנתיב נכון

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FlightsTableComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'] 
})

export class HomePageComponent implements OnInit {
  lastMinuteFlights: Flight[] = []; // טיסות לשבוע הקרוב

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    const today = new Date();
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 7);

    // סינון טיסות לשבוע הקרוב
    this.lastMinuteFlights = this.flightService.list().filter((flight: Flight) =>
      flight.boardingDate >= today && flight.boardingDate <= oneWeekFromToday
    );    
  }
}
