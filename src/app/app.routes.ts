import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { FlightsTableComponent } from './features/flights/pages/flights-table/flights-table.component';
import { BookFlightComponent } from './features/flights/pages/book-flight/book-flight.component';
import { FlightsComponent } from './features/flights/pages/flights/flights.component';
import { EditFlightComponent } from './features/flights/pages/edit-flight/edit-flight.component';
import { HelpPageComponent } from './features/help-page/help-page.component';
import { DestinationsComponent } from './features/destinations/pages/destinations/destinations.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent }, 
    { path: 'find-flight', component: FlightsTableComponent, data: { tableTitle: 'Book a flight'}},
    { path: 'book/:flightNumber', component: BookFlightComponent }, 
    { path: 'flights', component: FlightsComponent },
    { path: 'edit-flight/:flightNumber', component: EditFlightComponent },
    { path: 'help', component: HelpPageComponent },
    { path: '**', redirectTo: '' },
    { path: 'destinations', component: DestinationsComponent },
];

export const appRouterProviders = [
    provideRouter(routes)
  ];