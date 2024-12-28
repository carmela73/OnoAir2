import { Component, OnInit} from '@angular/core';
import { Flight } from '../../model/flight.model';
import { FlightService } from '../../service/flight.service'
import { RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [MatIconModule, RouterModule, MatTableModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})

export class FlightsComponent implements OnInit {
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats','actions'];

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const allFlights = this.flightService.list();
    this.flights = new MatTableDataSource(allFlights);
  }
  
}
