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
    await this.loadDestinations();
  }

  async loadDestinations() {
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
    await this.destinationService.updateDestinationStatus(destinationCode, 'Cancelled'); 
    await this.loadDestinations();
  }

  async toggleDestinationStatus(destination: Destination) {
    if (destination.status === 'Active') {
      await this.openCancelDialog(destination.code);
    } else {
      const dialogRef = this.dialog.open(CancelDestinationDialogComponent, {
        data: { 
          destinationCode: destination.code, 
          confirmMessage: `Are you sure you want to reactivate destination ${destination.code}?`
        }
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.destinationService.updateDestinationStatus(destination.code, 'Active'); 
          await this.loadDestinations(); 
        }
      });
    }
  }

   

}
