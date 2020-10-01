import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Training } from '../interfaces/training';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {

  private apiurl = 'api/training';


  // private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');

  // private httpOptions = {
  //   headers: this.headers
  // };

  constructor(private readonly http: HttpClient) {
  }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiurl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getTeacherTrainings(id: string): Observable<Training[]> {
    const url = `${this.apiurl}/teacher/${id}`
    return this.http.get<Training[]>(url).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getStudentTrainings(id: string): Observable<Training[]> {
    const url = `${this.apiurl}/student/${id}`
    return this.http.get<Training[]>(url).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  addTraining(training: any): Observable<Training> {
    return this.http.post<Training>(this.apiurl, training).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateTraining(trainingId: string, updateData: Training): Observable<Training> {
    const url = `${this.apiurl}/${trainingId}`
    return this.http.put<Training>(url, updateData).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  deleteTraining(trainingId: string): Observable<Training> {
    const url = `${this.apiurl}/${trainingId}`
    return this.http.delete<Training>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

}
