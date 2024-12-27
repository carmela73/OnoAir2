import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { FlightsTableComponent } from './features/flights/pages/flights-table/flights-table.component'; // טבלת הטיסות
import { BookFlightComponent } from './features/flights/pages/book-flight/book-flight.component'; // נתיב מעודכן
import { FlightsComponent } from './features/flights/pages/flights/flights.component'; // טיסות

export const routes: Routes = [
    { path: '', component: HomePageComponent }, // דף הבית
    { path: 'find-flight', component: FlightsTableComponent, data: { tableTitle: 'Book a flight'}},
    { path: 'book/:flightNumber', component: BookFlightComponent }, //דף הזמנת טיסה
    { path: 'flights', component: FlightsComponent },
    { path: '**', redirectTo: '' } // הפניה לנתיב ברירת מחדל
];

export const appRouterProviders = [
    provideRouter(routes)
  ];