import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Question } from '../interfaces/question';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {


  private apiUrl = 'api/questions'

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  addQuestion(question: Question): Observable<Question> {

    return this.http.post<Question>(this.apiUrl, question).pipe(
      tap(data => data),
      catchError(this.handleError)
    );
  }

  updateQuestion(questionId: string, updateData: Question): Observable<Question> {
    const url = `${this.apiUrl}/${questionId}`
    return this.http.put<Question>(url, updateData).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  deleteQuestion(questionId: string): Observable<Question>{
    const url = `${this.apiUrl}/${questionId}`
    return this.http.delete<Question>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }
}
