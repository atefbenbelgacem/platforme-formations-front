import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { VeilleEvent } from '../interfaces/veille-event';

@Injectable({
  providedIn: 'root'
})
export class VeilleEventService {

  private apiurl = 'api/veille';

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  getAllVeilles(): Observable<VeilleEvent[]> {
    return this.http.get<VeilleEvent[]>(this.apiurl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getVeilleByPole(poleId: string) {
    const url = `${this.apiurl}/pole/${poleId}`
    return this.http.get<VeilleEvent[]>(url).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  addVeille(veille: VeilleEvent): Observable<VeilleEvent> {
    return this.http.post<VeilleEvent>(this.apiurl, veille).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateVeille(veilleId: string, updateData: VeilleEvent): Observable<VeilleEvent> {
    const url = `${this.apiurl}/${veilleId}`
    return this.http.put<VeilleEvent>(url, updateData).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  deleteVeille(veilleId: string): Observable<VeilleEvent> {
    const url = `${this.apiurl}/${veilleId}`
    return this.http.delete<VeilleEvent>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }
}
