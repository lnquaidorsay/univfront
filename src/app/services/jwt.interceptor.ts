import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private token: TokenService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.token.getToken();
    console.log("token in interceptor : ",token);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token.getToken()}`
      }
    });

    return next.handle(request);
  }
}
