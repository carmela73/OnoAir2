import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelFlightDialogComponent } from '../cancel-flight-dialog/cancel-flight-dialog.component';

@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule, MatTableModule, MatSortModule, MatDialogModule],
  templateUrl: './flights-table.component.html',
  styleUrls: ['./flights-table.component.css']
})

export class FlightsTableComponent implements OnInit {
  isAdmin: boolean = false; 
  tableTitle: string = '';
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  async ngOnInit() {
    this.isAdmin = this.route.routeConfig?.path === 'flights'; // manager screen
    this.tableTitle = this.isAdmin ? 'Manage Flights' : 'Book a Flight';

    this.displayedColumns = this.isAdmin 
    ? ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'status', 'actions'] 
    : ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'actions'];
    await this.loadFlights();
  }

  async loadFlights() {
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

  openCancelDialog(flightNumber: string) {
    const dialogRef = this.dialog.open(CancelFlightDialogComponent, {
      data: { flightNumber }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) { 
        await this.cancelFlight(flightNumber);
      }
    });
  }

  async cancelFlight(flightNumber: string) {
    await this.flightService.cancelFlight(flightNumber); 
    await this.loadFlights();
  }


}