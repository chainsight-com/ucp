import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { AccountCtrlApiService } from 'src/sdk/api/account-ctrl.service';
import { Account } from 'src/sdk/model/account';
export const LOCAL_TOKEN_KEY = 'access_token';
export const LOCAL_ME = 'me';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private jwtHelper: JwtHelperService, private accountApiService: AccountCtrlApiService) {

  }
  loginStatus$ = new BehaviorSubject<boolean>(false);
  currentAccount$ = new BehaviorSubject<Account>(null);
  isTokenExpired(): boolean {
    const jwtStr = this.getToken();
    if (jwtStr) {
      return this.jwtHelper.isTokenExpired(jwtStr);
    } else {
      return true;
    }
  }

  writeToken(value: string) {
    localStorage.setItem(LOCAL_TOKEN_KEY, value);
    const tknObj = this.jwtHelper.decodeToken(value);
    this.accountApiService.getMeUsingGETDefault().subscribe(account => {
      localStorage.setItem(LOCAL_ME, JSON.stringify(account));
      this.loginStatus$.next(true);
      this.currentAccount$.next(account);
    });
  }

  getToken(): string {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }

  getMe(): Account {
    const accountJson = localStorage.getItem(LOCAL_ME);
    if (!accountJson) {
      return null;
    }
    return JSON.parse(accountJson);
  }

  removeToken() {
    if (this.getToken()) {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
    }
    this.loginStatus$.next(false);
    this.currentAccount$.next(null);
  }

  init() {
    if (this.isTokenExpired()) {
      this.removeToken();
    } else {
      this.writeToken(this.getToken());
    }
  }

}