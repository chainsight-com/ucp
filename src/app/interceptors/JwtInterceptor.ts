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

        return next.handle(request);
    }
}
