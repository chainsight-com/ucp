import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {UserService} from "../services/user.service";


@Injectable()
export class LogoutInterceptor implements HttpInterceptor {
  constructor(private router: Router, private userService: UserService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.userService.signOut();
            this.router.navigateByUrl('/login');
          }
        }
        // return of(err);
        return throwError(err);
      }));
  }
}
