import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CountryReport } from '../models/country-report.model';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  private covidReportsCache$ = new BehaviorSubject<CountryReport[]>([]);
  private readonly API = 'https://disease.sh/v3/covid-19';
  private http = inject(HttpClient);

  public getAll(): Observable<CountryReport[]> {
    // Check if the cache is empty
    if (this.covidReportsCache$.getValue().length === 0) {
      // Fetch data from API and cache it
      return this.http
        .get<CountryReport[]>(`${this.API}/countries`)
        .pipe(tap((res) => this.covidReportsCache$.next(res)));
    } else {
      // Return cached data as an Observable
      return this.covidReportsCache$.asObservable();
    }
  }

  public getOneByCountry(country: string): Observable<CountryReport> {
    return this.http.get<CountryReport>(`${this.API}/countries/${country}`);
  }
}
