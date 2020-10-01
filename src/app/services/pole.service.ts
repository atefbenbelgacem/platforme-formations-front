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
}
