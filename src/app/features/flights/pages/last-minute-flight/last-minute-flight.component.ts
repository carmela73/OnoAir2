import { Component, Input } from '@angular/core';
import { Flight } from '../../model/flight.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';	
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-last-minute-flight',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './last-minute-flight.component.html',
  styleUrls: ['./last-minute-flight.component.css']
})

export class LastMinuteFlightComponent {
  @Input() flight!: Flight;
}
