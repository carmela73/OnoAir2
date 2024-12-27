import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../service/flight.service';
import { Flight } from '../../model/flight.model';

@Component({
  selector: 'app-edit-flight',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css']
})

export class EditFlightComponent implements OnInit {
  flight: Flight | undefined;

  constructor(private flightService: FlightService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const flightNumber = this.route.snapshot.paramMap.get('flightNumber');
    if (flightNumber) {
      this.flight = this.flightService.get(flightNumber);
    }
  }
}