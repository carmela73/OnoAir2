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
  destination: Destination | null = null;

  constructor(private route: ActivatedRoute,private destinationService: DestinationService) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.destination = this.destinationService.get(code) ?? null;
    }
  }
}
