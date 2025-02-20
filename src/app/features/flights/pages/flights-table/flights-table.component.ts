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
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BookingService } from '../../../bookings/service/booking.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule, MatTableModule, MatSortModule, MatDialogModule, FormsModule, MatSelectModule, DatePickerComponent, MatButtonToggleModule],
  templateUrl: './flights-table.component.html',
  styleUrls: ['./flights-table.component.css']
})

export class FlightsTableComponent implements OnInit {
  isAdmin: boolean = false; 
  tableTitle: string = '';
  flights!: MatTableDataSource<Flight>;
  displayedColumns: string[] = [];

  selectedOrigin: string = '';
  selectedDestination: string = '';
  uniqueOrigins: string[] = [];
  uniqueDestinations: string[] = [];
  allFlights: Flight[] = [];
  homepage: boolean = false;

  boardingDate?: Date;
  arrivalDate?: Date;
  boardingMonth?: number;
  arrivalMonth?: number;

  searchMode: 'specific' | 'flexible' = 'specific';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute, private bookingService: BookingService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.isAdmin = this.route.routeConfig?.path === 'flights'; // manager screen
    this.homepage = this.route.routeConfig?.path === ''; // homepage
    this.tableTitle = this.isAdmin ? 'Manage Flights' : 'Book a Flight';

    this.displayedColumns = this.isAdmin 
    ? ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'status', 'actions'] 
    : ['flightNumber', 'origin', 'destination', 'boardingDate', 'arrivalDate', 'numberOfSeats', 'actions'];
    await this.loadFlights();
  }

  async loadFlights() {
    const allFlights = await this.flightService.list();
    const futureFlights = await this.flightService.listFutureFlights();
  
    this.allFlights = this.isAdmin ? allFlights : futureFlights;
    this.flights = new MatTableDataSource(this.allFlights);
  
    this.uniqueOrigins = [...new Set(this.allFlights.map(flight => flight.origin))];
    this.uniqueDestinations = [...new Set(this.allFlights.map(flight => flight.destination))];
  
    setTimeout(() => {
      this.flights.sort = this.sort;
    });
  }
  
  editFlight(flightNumber: string): void {
    this.router.navigate(['/edit-flight', flightNumber]);
  }  

  async openCancelDialog(flightNumber: string) {
    const hasActiveBookings = await this.bookingService.hasActiveBookings(flightNumber);
  
    if (hasActiveBookings) {
      this.dialog.open(CancelFlightDialogComponent, {
        data: { 
          flightNumber, 
          errorMessage: `Cannot cancel flight ${flightNumber} because there are active bookings.`
        }
      });
      return;
    }
  
    const dialogRef = this.dialog.open(CancelFlightDialogComponent, {
      data: { flightNumber, errorMessage: null }
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

  isNoFlights: boolean = false;

  async applyFilters() {
    let filteredFlights: Flight[];
  
    if (this.boardingMonth === undefined || this.boardingMonth === null) {
      filteredFlights = await this.flightService.listFutureFlights();
    } else {
      const startDate = new Date(2025, this.boardingMonth - 1, 1, 0, 0, 0);
      const endDate = new Date(2025, this.boardingMonth, 0, 23, 59, 59);
  
      filteredFlights = await this.flightService.getFlightsByDateRange(startDate, endDate);
    }  
    filteredFlights = filteredFlights.filter(flight => {
      const matchesOrigin = !this.selectedOrigin || flight.origin === this.selectedOrigin;
      const matchesDestination = !this.selectedDestination || flight.destination === this.selectedDestination;
      return matchesOrigin && matchesDestination;
    });  
    this.flights = new MatTableDataSource(filteredFlights);
    this.isNoFlights = filteredFlights.length === 0;
  }       

  async toggleFlightStatus(flight: Flight) {
    if (flight.status === 'Active') {
      await this.openCancelDialog(flight.flightNumber);
    } else {
      const dialogRef = this.dialog.open(CancelFlightDialogComponent, {
        data: { 
          flightNumber: flight.flightNumber, 
          confirmMessage: `Are you sure you want to reactivate flight ${flight.flightNumber}?`
        }
      });
  
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.flightService.updateFlightStatus(flight.flightNumber, 'Active'); 
          await this.loadFlights(); 
        }
      });
    }
  }

  onMonthSelected(selectedMonth: number | null) {
    if (selectedMonth === null) {
      this.boardingMonth = undefined;
    } else {
      this.boardingMonth = selectedMonth;
    }
    this.applyFilters();
  }  
  
  onDateSelected(selectedDate: Date) {
    this.boardingDate = selectedDate;
    this.applyFilters();
  }  
  
}