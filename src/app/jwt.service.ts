import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from './model/user';
export const LOCAL_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private jwtHelper: JwtHelperService) {

  }
  loginStatus$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<User>(null);
  isTokenExpired(token: string = LOCAL_TOKEN_KEY): boolean {
    let jwtStr = this.getToken(token);
    if (jwtStr) {
      return this.jwtHelper.isTokenExpired(jwtStr);
    } else {
      return true;
    }
  }

  writeToken(value: string, token: string = LOCAL_TOKEN_KEY) {
    localStorage.setItem(token, value);
    const tknObj = this.jwtHelper.decodeToken(value);
    this.loginStatus$.next(true);
    this.currentUser$.next({
      username: tknObj.sub,
      displayName: tknObj.displayName,
      email: tknObj.email,
    });

  }

  getToken(token: string = LOCAL_TOKEN_KEY) {
    return localStorage.getItem(token);
  }

  removeToken(token: string = LOCAL_TOKEN_KEY) {
    if (this.getToken(token)) {
      localStorage.removeItem(token);
    }
    this.loginStatus$.next(false);
    this.currentUser$.next(null);
  }

}
