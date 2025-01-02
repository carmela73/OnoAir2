import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule, MatTableModule, MatSortModule],
  templateUrl: './flights-table.component.html',
  styleUrls: ['./flights-table.component.css']
})

export class FlightsTableComponent implements OnInit {
  isAdmin: boolean = false; 
  tableTitle: string = '';
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'actions'];

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isAdmin = this.route.routeConfig?.path === 'flights'; // manager screen
    this.tableTitle = this.isAdmin ? 'Manage Flights' : 'Book a Flight';

    const allFlights = this.flightService.list();
    const futureFlights = this.flightService.getFutureFlights();
    this.flights = new MatTableDataSource(this.isAdmin ? allFlights : futureFlights);
  }
}