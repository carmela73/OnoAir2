import { Component, OnInit } from '@angular/core';
import { Destination } from '../../model/destination.model';
import { DestinationService } from '../../service/destination.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})

export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];

  displayedColumns: string[] = ['code', 'name', 'airportName', 'website','image', 'actions'];

  constructor(private destinationService: DestinationService) {}

  ngOnInit(): void {
    this.destinations = this.destinationService.list();
  }
}