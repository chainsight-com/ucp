import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AuthService } from "angularx-social-login";
import { filter, map, mergeMap, take, takeUntil, tap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NzMessageService } from "ng-zorro-antd";
import { LoginState } from "../models/LoginState";
import { HttpClient } from "@angular/common/http";
import { AccountDto, ProjectDto } from '@chainsight/unblock-api-axios-sdk';
import { environment } from 'src/environments/environment';

// export const LOCAL_TOKEN_KEY = 'access_token';
// export const LOCAL_ME = 'me';
export const LOGIN_STATE = 'login_state';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loginState$ = new BehaviorSubject<LoginState>(null);
  // private _account$ = new BehaviorSubject<AccountDto>(null);
  private _project$ = new BehaviorSubject<ProjectDto>(null);
  private _availableProjects = new BehaviorSubject<ProjectDto[]>([]);

  public get loginState$(): Observable<LoginState> {
    return this._loginState$;
  }

  // public get account$(): Observable<AccountDto> {
  //   return this._account$;
  // }

  public get project$(): Observable<ProjectDto> {
    return this._project$;
  }

  public get loginState(): LoginState {
    const memLoginState = this._loginState$.getValue()
    if (memLoginState) {
      return memLoginState;
    }
    const loginStateStr = localStorage.getItem(LOGIN_STATE);
    if (loginStateStr) {
      return JSON.parse(loginStateStr);
    }
    return null;

  }

  public get project(): ProjectDto {
    return this._project$.getValue();
  }

  public get availableProjects$(): Observable<ProjectDto[]> {
    return this._availableProjects;
  }

  public get availableProjects(): ProjectDto[] {
    return this._availableProjects.getValue();
  }

  public get token(): string {
    if (this.loginState) {
      return this.loginState.accessToken;
    }
    return null;
  }


  constructor(
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private message: NzMessageService,
    private httpClient: HttpClient
  ) {
    this._loginState$
      .subscribe((loginState) => {
        if (!loginState) {
          this._project$.next(null);
          this._availableProjects.next([]);
          return;
        }
        const projects = loginState.me.accessibleProjects.map(pm => pm.project);
        this._availableProjects.next(projects);
        if (projects.length > 0) {
          this._project$.next(projects[0]);
        } else {
          message.error('No project is available for this account');
          this.signOut();
        }
      });

  }

  init() {
    if (this.hasValidToken()) {
      this.signIn(this.token);
    } else {
      this.signOut();
    }
  }


  hasValidToken(): boolean {
    const jwtStr = this.token;
    // console.log(jwtStr);
    if (jwtStr) {
      return !this.jwtHelper.isTokenExpired(jwtStr);
    }
    return false;
  }

  signIn(value: string) {
    const loginState = {
      accessToken: null,
      me: null
    }
    loginState.accessToken = value
    // localStorage.setItem(LOCAL_TOKEN_KEY, value);
    const tknObj = this.jwtHelper.decodeToken(value);
    this.httpClient.get(`${environment.baseApiUrl}/api/account/me`, {
      headers: {
        'Authorization': `Bearer ${value}`
      }
    })
      .subscribe((account: AccountDto) => {
        loginState.me = account;
        localStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
        // this._account$.next(account);
        this._loginState$.next(loginState);
      });

  }




  async signOut() {
    localStorage.removeItem(LOGIN_STATE);
    this._loginState$.next(null);
    // this._account$.next(null);
    this._project$.next(null);
    this._availableProjects.next([]);
    try {
      await this.authService.signOut(true);
    } catch (err) {
      console.error(err);
    }

  }


  public getMe(): AccountDto {
    if (!this.loginState) {
      return null;
    }
    return this.loginState.me;
  }

  public switchProject(project: ProjectDto) {
    this._project$.next(project);
  }


}
