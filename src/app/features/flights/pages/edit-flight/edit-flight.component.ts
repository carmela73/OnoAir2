import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flight.service';
import { Timestamp } from 'firebase/firestore';
import { Flight, FlightStatus } from '../../model/flight.model';
import { FormsModule, NgModelGroup } from '@angular/forms';
import { DestinationService } from '../../../destinations/service/destination.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Destination } from '../../../destinations/model/destination.model';

@Component({
  selector: 'app-edit-flight',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTimepickerModule ],
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css']
})

export class EditFlightComponent implements OnInit {
  @Input() flight: Flight = new Flight('', '', '', '', new Date(), new Date(), 1, FlightStatus.Active);
  flightId: string | null = null;
  destinations: Destination[] = [];  
  today: Date = new Date();
  flightStatuses = Object.values(FlightStatus);
  existingFlightNumbers: string[] = [];

  boardingDate: Date = new Date();
  boardingTime: string = '';
  arrivalDate: Date = new Date();
  arrivalTime: string = '';

  @ViewChild('flightForm') flightForm?: NgModelGroup;

  constructor(
    private flightService: FlightService,
    private destinationService: DestinationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {

    this.destinations = await this.destinationService.list(); 

    const flights = await this.flightService.list();
    this.existingFlightNumbers = flights.map(f => f.flightNumber);
    
    this.flightId = this.route.snapshot.paramMap.get('flightNumber');

    if (this.flightId) {
      const fetchedFlight = await this.flightService.get(this.flightId);
      if (fetchedFlight) {
        this.flight = fetchedFlight;

        this.flight.boardingDate = this.convertToDate(this.flight.boardingDate);
        this.flight.arrivalDate = this.convertToDate(this.flight.arrivalDate);
        
        this.boardingDate = new Date(this.flight.boardingDate);
        this.boardingTime = this.formatTime(this.flight.boardingDate);
        this.arrivalDate = new Date(this.flight.arrivalDate);
        this.arrivalTime = this.formatTime(this.flight.arrivalDate);
      }
    }
  }

    private convertToDate(date: any): Date {
      return date instanceof Timestamp ? date.toDate() : new Date(date);
    }

    formatTime(date: Date): string {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    showSuccessMessage = false;

    async saveFlight() {
      if (!this.flight) return;
    
      const existingFlight = await this.flightService.get(this.flight.flightNumber);
      if (existingFlight && this.flightId !== this.flight.flightNumber) {
        alert('A flight with this flight number already exists!');
        return;
      }
    
      const boardingTimeString = typeof this.boardingTime === 'string' 
        ? this.boardingTime 
        : this.formatTime(this.boardingTime);
    
      const arrivalTimeString = typeof this.arrivalTime === 'string' 
        ? this.arrivalTime 
        : this.formatTime(this.arrivalTime);
      
      if (this.flight.origin === this.flight.destination) {
        alert('Origin and destination must be different.');
        return;
      }

      if (!this.boardingTime || !this.arrivalTime) {
        alert("Please fill in both boarding and arrival times.");
        return;
      }

      const boardingDateTime = new Date(this.boardingDate);
      const [boardingHours, boardingMinutes] = boardingTimeString.split(':').map(Number);
      boardingDateTime.setHours(boardingHours, boardingMinutes);
    
      const arrivalDateTime = new Date(this.arrivalDate);
      const [arrivalHours, arrivalMinutes] = arrivalTimeString.split(':').map(Number);
      arrivalDateTime.setHours(arrivalHours, arrivalMinutes);
    
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (boardingDateTime < today) {
        alert('Boarding date must be in the future.');
        return;
      }
    
      if (arrivalDateTime <= boardingDateTime) {
        alert('Arrival date must be after the boarding date.');
        return;
      }    

      this.flight.boardingDate = boardingDateTime;
      this.flight.arrivalDate = arrivalDateTime;
    
      if (this.flightId === this.flight.flightNumber) {
        await this.flightService.updateFlight(this.flight);
      } else {
        await this.flightService.addFlight(this.flight);
      }
    
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.router.navigate(['/flights']);
      }, 3000);
    }
    
}