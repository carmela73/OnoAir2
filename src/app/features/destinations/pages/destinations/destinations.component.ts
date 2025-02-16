import { Component, OnInit } from '@angular/core';
import { Destination } from '../../model/destination.model';
import { DestinationService } from '../../service/destination.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CancelDestinationDialogComponent } from '../cancel-destination-dialog/cancel-destination-dialog.component';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})

export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];

  displayedColumns: string[] = ['code', 'name', 'airportName', 'website','email', 'image','status', 'actions'];

  constructor(private destinationService: DestinationService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.destinations = await this.destinationService.list();
  }

  async openCancelDialog(destinationCode: string) {
    const hasFlights = await this.destinationService.hasActiveFlights(destinationCode);
  
    if (hasFlights) {
      this.dialog.open(CancelDestinationDialogComponent, {
        data: { 
          destinationCode, 
          errorMessage: `Cannot cancel destination ${destinationCode} because there are active flights.`
        }
      });
      return;
    }
  
    const dialogRef = this.dialog.open(CancelDestinationDialogComponent, {
      data: { destinationCode, errorMessage: null }
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.cancelDestination(destinationCode);
      }
    });
  }
  
  
  async cancelDestination(destinationCode: string) {
    const success = await this.destinationService.cancelDestination(destinationCode);
    if (success) {
      this.destinations = await this.destinationService.list();
    }
  }

  async confirmCancelDestination(destinationCode: string) {
    const error = await this.destinationService.cancelDestination(destinationCode);
    if (error) {
      this.dialog.open(CancelDestinationDialogComponent, { data: { errorMessage: error } });
    } else {
      this.destinations = await this.destinationService.list(); 
    }
  }

}
