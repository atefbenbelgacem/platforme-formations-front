import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'api/users'

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  elasticSearch(email: string, page = 1): Observable<User[]> {
    const url = `${this.apiUrl}/email`
    const headers = new HttpHeaders().set('email', email);
    return this.http.get<User[]>(url, { headers: headers }).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  getEmailsUsers(emails: string[]): Observable<User[]> {
    const url = `${this.apiUrl}/emails`
    return this.http.post<User[]>(url, emails).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  add(data: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, data).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  update(userId: string, data: User): Observable<User> {
    const url = `${this.apiUrl}/${userId}`
    return this.http.put<User>(url, data).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  delete(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`
    return this.http.delete<User>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }
}
