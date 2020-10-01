import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Session } from '../interfaces/session';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private apiUrl = 'api/training/session'

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  addSession(session: Session, trainingId: string): Observable<Session> {
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.post<Session>(this.apiUrl, session, { headers: headers }).pipe(
      tap(data => data),
      catchError(this.handleError)
    );
  }

  getSessionById(sessionId: string): Observable<Session> {
    const url = `${this.apiUrl}/${sessionId}`;
    return this.http.get<Session>(url).pipe(
      map((data) => data),
      catchError(this.handleError)
    );
  }

  updateSession(sessionId: string, trainingId: string, updateData: Session): Observable<Session> {
    const url = `${this.apiUrl}/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.put<Session>(url, updateData, { headers: headers }).pipe(
      map((data) => data),
      catchError(this.handleError)
    );
  }

  deleteSession(sessionId: string, trainingId: string): Observable<Session> {
    const url = `${this.apiUrl}/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);

    return this.http.delete<Session>(url, { headers: headers }).pipe(
      catchError(this.handleError)
    )
  }

  uploadFile(sessionId: string, trainingId: string, document: any): Observable<Session> {
    const url = `${this.apiUrl}/addDocument/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.put<Session>(url, document, { headers: headers }).pipe(
      catchError(this.handleError)
    )
  }

  deleteFiles(sessionId: string, trainingId: string, documents: any): Observable<Session> {
    const url = `${this.apiUrl}/deleteDocuments/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.put<Session>(url, documents, { headers: headers }).pipe(
      catchError(this.handleError)
    )
  }

  addQuestions(sessionId: string, trainingId: string, questions: string[]): Observable<Session> {
    const url = `${this.apiUrl}/quizz/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.post<Session>(url, questions, { headers: headers }).pipe(
      catchError(this.handleError)
    )
  }

  deleteQuestions(sessionId: string, trainingId: string, questions: string[]): Observable<Session> {
    const url = `${this.apiUrl}/quizz/${sessionId}`;
    const headers = new HttpHeaders().set('trainingId', trainingId);
    return this.http.put<Session>(url, questions, { headers: headers }).pipe(
      catchError(this.handleError)
    )
  }


}
