import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightsTableComponent } from '../flights/pages/flights-table/flights-table.component';
import { Flight } from '../flights/model/flight.model';
import { FlightService } from '../flights/service/flight.service';
import { LastMinuteFlightComponent } from '../flights/pages/last-minute-flight/last-minute-flight.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FlightsTableComponent, LastMinuteFlightComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'] 
})

export class HomePageComponent implements OnInit {
  lastMinuteFlights: Flight[] = []; 

  constructor(private flightService: FlightService) {}

  async ngOnInit() {
      const today = new Date();
      const oneWeekFromToday = new Date();
      oneWeekFromToday.setDate(today.getDate() + 7);
  
      const flights = await this.flightService.list(); 
      this.lastMinuteFlights = flights.filter((flight: Flight) =>
        new Date(flight.boardingDate) >= today && new Date(flight.boardingDate) <= oneWeekFromToday && flight.status === 'Active'
      );
  }

  thereAreLastMinuteFlights(): boolean {
    return this.lastMinuteFlights.length > 0;
  }
}
