import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { FlightsTableComponent } from './features/flights/pages/flights-table/flights-table.component';
import { BookFlightComponent } from './features/flights/pages/book-flight/book-flight.component';
import { EditFlightComponent } from './features/flights/pages/edit-flight/edit-flight.component';
import { HelpPageComponent } from './features/help-page/help-page.component';
import { DestinationsComponent } from './features/destinations/pages/destinations/destinations.component';
import { ViewDestinationComponent } from './features/destinations/pages/view-destination/view-destination.component';
import { MyBookingsComponent } from './features/bookings/pages/my-bookings/my-bookings.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent }, 
    { path: 'find-flight', component: FlightsTableComponent},
    { path: 'book/:flightNumber', component: BookFlightComponent }, 
    { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
    { path: 'flights', component: FlightsTableComponent },
    { path: 'help', component: HelpPageComponent },
    { path: 'destinations', component: DestinationsComponent },
    { path: 'view-destination/:code', component: ViewDestinationComponent },
    { path: 'my-bookings', component: MyBookingsComponent },
    { path: 'view-booking/:bookingId', component: BookFlightComponent},
    { path: '**', redirectTo: '' }
];

export const appRouterProviders = [
    provideRouter(routes)
  ];