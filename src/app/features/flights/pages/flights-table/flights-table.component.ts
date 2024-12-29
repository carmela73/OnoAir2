import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatButtonModule, RouterModule],
  templateUrl: './flights-table.component.html',
  styleUrls: ['./flights-table.component.css']
})

export class FlightsTableComponent implements OnInit {
  @Input() tableTitle: string = ''; 
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats','actions'];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {this.tableTitle = data['tableTitle'] || 'Find a Flight';});
    const futureFlights = this.flightService.getFutureFlights();
    this.flights = new MatTableDataSource(futureFlights);
    this.flights.sort = this.sort;
  }  
  
}
