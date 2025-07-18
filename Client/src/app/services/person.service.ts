import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person, CreatePersonRequest, UpdatePersonRequest, PagedResponse } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly apiUrl = 'http://localhost:5221/api/persons';

  constructor(private http: HttpClient) {}

  getPersons(page: number = 1, pageSize: number = 10): Observable<PagedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse>(this.apiUrl, { params });
  }

  getPersonById(personId: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${personId}`);
  }

  createPerson(request: CreatePersonRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  updatePerson(request: UpdatePersonRequest): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${request.personId}`, request);
  }

  deletePerson(personId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${personId}`);
  }
}