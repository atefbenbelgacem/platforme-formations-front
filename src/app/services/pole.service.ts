import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Pole } from '../interfaces/pole';

@Injectable({
  providedIn: 'root'
})
export class PoleService {

  private apiurl = 'api/poles';

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  getAllPoles(): Observable<Pole[]> {
    return this.http.get<Pole[]>(this.apiurl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  add(data: Pole): Observable<Pole> {
    return this.http.post<Pole>(this.apiurl, data).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  update(poleId: string, data: Pole): Observable<Pole> {
    const url = `${this.apiurl}/${poleId}`
    return this.http.put<Pole>(url, data).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  delete(poleId: string): Observable<Pole> {
    const url = `${this.apiurl}/${poleId}`
    return this.http.delete<Pole>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }
}
