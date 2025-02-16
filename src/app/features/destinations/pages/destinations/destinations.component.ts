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

  openCancelDialog(destinationCode: string) {
    const dialogRef = this.dialog.open(CancelDestinationDialogComponent, {
      data: { destinationCode }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.cancelDestination(destinationCode);
      }
    });
  }

  async cancelDestination(destinationCode: string) {
    await this.destinationService.cancelDestination(destinationCode);
    this.destinations = await this.destinationService.list();
  }
  
}
