import { Component, OnInit} from '@angular/core';
import { Flight } from '../../model/flight.model';
import { FlightService } from '../../service/flight.service'
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [MatIconModule, RouterModule, MatTableModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})

export class FlightsComponent implements OnInit {
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats','actions'];

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.flights = new MatTableDataSource(this.flightService.list());
  }
}
