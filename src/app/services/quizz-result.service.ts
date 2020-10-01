import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { QuizzResult } from '../interfaces/quizz-result';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizzResultService {

  private apiUrl = 'api/quizz-result'

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  addResult(quizzResult: QuizzResult): Observable<QuizzResult> {
    return this.http.post<QuizzResult>(this.apiUrl, quizzResult).pipe(
      tap(data => data),
      catchError(this.handleError)
    );
  }

  getUserResult(userId: string, sessionId: string): Observable<QuizzResult> {
    const url = `${this.apiUrl}/user/${userId}`;
    const headers = new HttpHeaders().set('sessionid', sessionId);
    return this.http.get<QuizzResult>(url, { headers: headers }).pipe(
      map((data) => data),
      catchError(this.handleError)
    );
  }

  getAllUserResults(userId: string): Observable<QuizzResult[]> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<QuizzResult[]>(url).pipe(
      map((data) => data),
      catchError(this.handleError)
    );
  }

  getSessionResults(sessionId: string): Observable<QuizzResult[]> {
    const url = `${this.apiUrl}/session/${sessionId}`;
    return this.http.get<QuizzResult[]>(url).pipe(
      map((data) => data),
      catchError(this.handleError)
    );
  }

}
