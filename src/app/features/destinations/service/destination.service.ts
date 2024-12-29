import { Injectable } from '@angular/core';
import { Destination } from '../model/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private destinations: Destination[] = [
    new Destination('JFK', 'New York', 'John F. Kennedy International Airport', 'https://www.jfkairport.com/', 'https://www.lametayel.co.il/limages/744f38dce7d6704411124277fb7beba1.jpg?size=830x0&type=r'),
    new Destination('KRK', 'Krakow', 'John Paul II Airport', 'https://www.krakowairport.pl/pl', 'https://www.elal.com/magazine/wp-content/uploads/2023/09/krakow-rynek-glowwny-806x463-shutterstock_1341413513.jpg'),
    new Destination('FRA', 'Frankfurt', 'Frankfurt Airport', 'https://www.frankfurt-airport.com/en.html', 'https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_145475239.jpg'),
    new Destination('TLV', 'Tel Aviv', 'Ben Gurion Airport', 'https://www.iaa.gov.il/en/', 'https://www.zmantelaviv.com/wp-content/uploads/2023/09/2.jpg'),
    new Destination('VIE', 'Vienna', 'Vienna Airport', 'https://www.viennaairport.com/en/passengers', 'https://www.elal.com/magazine/wp-content/uploads/2017/05/shutterstock_238923085-1.jpg'),
    new Destination('FCO', 'Rome', 'Leonardo da Vinci Rome Fiumicino Airport', 'https://www.adr.it/web/aeroporti-di-roma-en', 'https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_147643964.jpg'),
    new Destination('BCN', 'Barcelona', 'Josep Tarradellas Barcelona–El Prat Airport', 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat.html', 'https://www.elal.com/magazine/wp-content/uploads/2017/01/shutterstock_229604983.jpg'),
    new Destination('ATH', 'Athens', 'Athens International Airport Eleftherios Venizelos', 'https://www.aia.gr/en', 'https://www.elal.com/magazine/wp-content/uploads/2018/07/shutterstock_776615074.jpg'),
    new Destination('ZRH', 'Zurich', 'Zurich Airport', 'https://www.flughafen-zuerich.ch/en/passengers', 'https://www.easygo.co.il/clients/easygo/gallery/Zurich/zuirch-1-756.jpg'),
    new Destination('LHR', 'London', 'Heathrow Airport', 'https://www.heathrow.com/', 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRj8g2WGx2WKl5DjBWBUSrjKrxZ9s4_PGHPlZJi7Cth748HVkEG6BvXcPFQ7uyLUJfGmlKic1YO_LCZ7jepcZH2C5bUFSt2cpHY0uEIjA'),
    new Destination('HND', 'Tokyo', 'Haneda Airport', 'https://tokyo-haneda.com/en/', 'https://blog.easygo.co.il/wp-content/uploads/2019/09/tokyo2.jpg')
  ];

  constructor() {}

  list(): Destination[] {
    return this.destinations;
  }

  get(code: string): Destination | undefined {
    return this.destinations.find(destination => destination.code === code);
  }
}