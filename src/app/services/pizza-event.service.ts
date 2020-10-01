import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PizzaEvent } from '../interfaces/pizza-event';

@Injectable({
  providedIn: 'root'
})
export class PizzaEventService {

  private apiurl = 'api/pizza-u';

  constructor(private readonly http: HttpClient) { }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  addPizza(pizza: PizzaEvent): Observable<PizzaEvent> {
    return this.http.post<PizzaEvent>(this.apiurl, pizza).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getAllPizzas(): Observable<PizzaEvent[]> {
    return this.http.get<PizzaEvent[]>(this.apiurl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updatePizza(pizzaId: string, updateData: PizzaEvent): Observable<PizzaEvent> {
    const url = `${this.apiurl}/${pizzaId}`
    return this.http.put<PizzaEvent>(url, updateData).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  deletePizza(pizzaId: string): Observable<PizzaEvent> {
    const url = `${this.apiurl}/${pizzaId}`
    return this.http.delete<PizzaEvent>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  adminSubscribe(pizzaId: string, userId: string): Observable<boolean>{
    const url = `${this.apiurl}/adminSubscribe/${pizzaId}`
    return this.http.put<boolean>(url, {userId: userId}).pipe(
      tap(),
      catchError(this.handleError)
    )
  }
  adminUnSubscribe(pizzaId: string, userId: string): Observable<boolean>{
    const url = `${this.apiurl}/adminUnSubscribe/${pizzaId}`
    return this.http.put<boolean>(url, {userId: userId}).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  subscribe(pizzaId: string): Observable<boolean>{
    const url = `${this.apiurl}/subscribe/${pizzaId}`
    return this.http.get<boolean>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  unSubscribe(pizzaId: string): Observable<boolean>{
    const url = `${this.apiurl}/unSubscribe/${pizzaId}`
    return this.http.get<boolean>(url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

}
