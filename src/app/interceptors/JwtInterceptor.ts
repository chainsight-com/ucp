import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtService} from '../services/jwt.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.jwtService.isTokenExpired()) {
      const token = this.jwtService.getToken();
      return next.handle(
        request.clone({
          headers: request.headers.append('Authorization', 'Bearer ' + token)
        })
      );
    }
    const token = this.jwtService.getToken();
    return next.handle(
      request.clone({
        headers: request.headers.append('Authorization', 'Bearer ' + token)
      })
    );
    return next.handle(request);
  }
}
