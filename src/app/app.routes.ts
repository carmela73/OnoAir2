import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { FlightsTableComponent } from './features/flights/pages/flights-table/flights-table.component'; // טבלת הטיסות

export const routes: Routes = [
    { path: '', component: HomePageComponent }, // דף הבית
    { path: 'find-flight', component: FlightsTableComponent},
    { path: '**', redirectTo: '' } // הפניה לנתיב ברירת מחדל
];

export const appRouterProviders = [
    provideRouter(routes)
  ];