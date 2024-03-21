import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Realizamos las operaciones de comunicación con nuestro backend mediante peticiones HTTP
export class EventService {
  private baseUrl = 'http://localhost:3000/event';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  //eventData contiene los datos que deseamos enviar al backend
  //Se retorna un observable que emitirá la respuesta del servidor
  createEvent(eventData: any): Observable<any> {
    console.log('Enviando evento al backend:', eventData);
    return this.http.post(this.baseUrl, eventData);
  }

  updateEvent(id: number, eventData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, eventData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}`);
  }

  getInscriptionsCount(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}/inscriptions/count`);
  }

}
