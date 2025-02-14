import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSort } from '@angular/material/sort';

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
  displayedColumns: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.isAdmin = this.route.routeConfig?.path === 'flights'; // manager screen
    this.tableTitle = this.isAdmin ? 'Manage Flights' : 'Book a Flight';

    this.displayedColumns = this.isAdmin 
    ? ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'status', 'actions'] 
    : ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'actions'];
  
    const allFlights = await this.flightService.list(); 
    const futureFlights = await this.flightService.listFutureFlights(); 
    
    this.flights = new MatTableDataSource(this.isAdmin ? allFlights : futureFlights);
  
    setTimeout(() => {
      this.flights.sort = this.sort;
    });
  }
  
  editFlight(flightNumber: string): void {
    this.router.navigate(['/edit-flight', flightNumber]);
  }  

}