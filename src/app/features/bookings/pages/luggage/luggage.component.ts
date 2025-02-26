import { Component, Input } from '@angular/core';
import { Luggage } from '../../model/booking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-luggage',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './luggage.component.html',
  styleUrl: './luggage.component.css'
})

export class LuggageComponent {
  @Input() luggage!: Luggage;

  getSafeArray(arr: any): number[] {
    return Array.isArray(arr) ? arr : [];
  }

  getTotalItems(): number {
    return this.getSafeArray(this.luggage?.cabin).length +
           this.getSafeArray(this.luggage?.checked).length +
           this.getSafeArray(this.luggage?.heavy).length;
  }

  getTotalWeight(): number {
    return this.getSafeArray(this.luggage?.cabin).reduce((sum, w) => sum + (w ?? 0), 0) +
           this.getSafeArray(this.luggage?.checked).reduce((sum, w) => sum + (w ?? 0), 0) +
           this.getSafeArray(this.luggage?.heavy).reduce((sum, w) => sum + (w ?? 0), 0);
  }

}
