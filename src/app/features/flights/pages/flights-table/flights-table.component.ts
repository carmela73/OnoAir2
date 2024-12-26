import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatButtonModule, RouterModule],
  templateUrl: './flights-table.component.html',
  styleUrls: ['./flights-table.component.css']
})

export class FlightsTableComponent implements OnInit {
  @Input() tableTitle: string = ''; // פרמטר לקבלת הכותרת
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats','actions'];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tableTitle = this.route.snapshot.data['tableTitle'] || this.tableTitle;
    this.flights = new MatTableDataSource(this.flightService.list());
    this.flights.sort = this.sort;
  }
}
