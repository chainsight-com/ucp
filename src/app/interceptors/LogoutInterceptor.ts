import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpResponse,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
// import { routerNgProbeToken } from '@angular/router/src/router_module';
import { JwtService } from '../services/jwt.service';
import { tap, catchError } from 'rxjs/operators';
@Injectable()
export class LogoutInterceptor implements HttpInterceptor {
    constructor(private router: Router, private jwtService: JwtService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 || err.status === 403) {
                        this.jwtService.removeToken();
                        this.router.navigateByUrl('/login');
                    }
                }
                return of(err);
            }));
    }
}
