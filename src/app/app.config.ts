import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding  } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { importProvidersFrom } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,  withComponentInputBinding()),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({"projectId":"onoair-project", "appId": "1:124205044355:web:80278fbd0b583e17a041b6", "storageBucket": "onoair-project.firebasestorage.app", "apiKey": "AIzaSyDrSoHhunQpvE0d-GzJJ6eKesjKIqXtgnQ", "authDomain": "onoair-project.firebaseapp.com", "messagingSenderId": "124205044355"})), provideFirestore(() => getFirestore()), 
    importProvidersFrom(MatDatepickerModule, MatNativeDateModule, MatButtonModule),
  ], 
};

