import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { DestinationService } from '../../service/destination.service';
import { Destination, DestinationStatus } from '../../model/destination.model';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-view-destination',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule],
  templateUrl: './view-destination.component.html',
  styleUrls: ['./view-destination.component.css']
})

export class ViewDestinationComponent implements OnInit {
  @Input() destinationCode!: string;
  destination! : Destination;
  destinationStatuses = Object.values(DestinationStatus);
  showSuccessMessage = false;
  existingDestinationCodes: string[] = [];
  isDuplicateCode = false;

  constructor(private route: ActivatedRoute, private destinationService: DestinationService,  private router: Router) {}

  async ngOnInit() {
    if (!this.destinationCode) {
      this.route.paramMap.subscribe(async params => {
        this.destinationCode = params.get('code')!;
        await this.loadDestination();
      });
    } else {
      await this.loadDestination();
    }

    // טעינת כל קודי היעדים הקיימים
    const destinations = await this.destinationService.list();
    this.existingDestinationCodes = destinations.map(dest => dest.code);
  }

  async loadDestination() {
    const foundDestination = await this.destinationService.getByCode(this.destinationCode);
    if (foundDestination) {
      this.destination = foundDestination;
    }
  }

  validateDuplicateCode(): boolean {
    return this.existingDestinationCodes.includes(this.destination.code) &&
           this.destination.code !== this.destinationCode;
  }

  async saveDestination() {
    if (!this.destination || this.isDuplicateCode) return;

    if (this.validateDuplicateCode()) {
      alert("A destination with this code already exists!");
      return;
    }

    const originalDestination = await this.destinationService.getByCode(this.destinationCode);

    if (originalDestination && originalDestination.code !== this.destination.code) {
      await this.destinationService.addDestination(this.destination);
    } else {
      await this.destinationService.updateDestination(this.destination);
    }

    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.router.navigate(['/destinations']);
    }, 3000);
  }

}

