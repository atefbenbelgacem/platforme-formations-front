import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq: HttpRequest<any>
    if (request.url !== 'https://file.io') {
      authReq = request.clone({
        headers: request.headers.set('access_token', this.getToken())
          .append('Access-Control-Allow-Origin', '*')
      });
    }else{
      authReq = request.clone()
    }


    return next.handle(authReq)

  }

  private getToken(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      const helper = new JwtHelperService();
      const isExpired = helper.isTokenExpired(currentUser.token);
      if (isExpired) {
        sessionStorage.removeItem('currentUser');
        this.router.navigate(['/auth']);
      }
      console.log('token added')
      return currentUser.token

    } else {
      console.log('no token needed')
      return ''
    }
  }
}
