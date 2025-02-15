import { Component, Input, OnInit } from '@angular/core';
import { Flight } from '../../model/flight.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';	
import { MatButtonModule } from '@angular/material/button';
import { DestinationService } from '../../../destinations/service/destination.service';

@Component({
  selector: 'app-last-minute-flight',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css']
})

export class LastMinuteFlightComponent implements OnInit {
  @Input() flight!: Flight;
  destinationImageUrl: string = ''; 

  constructor(private destinationService: DestinationService) {}

  async ngOnInit() {
    if (this.flight.destination) {
      const destination = await this.destinationService.getByName(this.flight.destination);
      if (destination && destination.imageUrl) {
        this.destinationImageUrl = destination.imageUrl;
      }
    }
  }
}

