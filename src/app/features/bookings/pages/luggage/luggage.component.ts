import { Component, Input } from '@angular/core';
import { Luggage } from '../../model/booking.model';

@Component({
  selector: 'app-luggage',
  standalone: true,
  imports: [],
  templateUrl: './luggage.component.html',
  styleUrl: './luggage.component.css'
})

export class LuggageComponent {
  @Input() luggage!: Luggage;
}
