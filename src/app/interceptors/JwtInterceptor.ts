import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.userService.isTokenExpired()) {
      const token = this.userService.getToken();
      return next.handle(
        request.clone({
          headers: request.headers.append('Authorization', 'Bearer ' + token)
        })
      );
    }
    const token = this.userService.getToken();
    return next.handle(
      request.clone({
        headers: request.headers.append('Authorization', 'Bearer ' + token)
      })
    );
    return next.handle(request);
  }
}
