import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../service/destination.service';
import { Destination } from '../../model/destination.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-destination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-destination.component.html',
  styleUrls: ['./view-destination.component.css']
})

export class ViewDestinationComponent implements OnInit {
  destination? : Destination;

  constructor(private route: ActivatedRoute,private destinationService: DestinationService) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const code = params.get('code')
    if (code) {
      this.destination = await this.destinationService.getByCode(code);
    }
   });
  }

} 
