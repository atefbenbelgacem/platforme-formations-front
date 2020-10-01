import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http
    .post<any>('api/auth/login', {username, password})
    .pipe(
      catchError(err =>{
        return throwError(err);
      })
    )
  }
}
