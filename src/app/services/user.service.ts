import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountApiService, AccountDto, ProjectDto} from '@profyu/unblock-ng-sdk';
import {AuthService} from "angularx-social-login";
import {filter, map, mergeMap, take, takeUntil, tap} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {NzMessageService} from "ng-zorro-antd";

export const LOCAL_TOKEN_KEY = 'access_token';
export const LOCAL_ME = 'me';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loginStatus$ = new BehaviorSubject<boolean>(false);
  private _account$ = new BehaviorSubject<AccountDto>(null);
  private _project$ = new BehaviorSubject<ProjectDto>(null);
  private _availableProjects = new BehaviorSubject<ProjectDto[]>([]);

  public get account$(): Observable<AccountDto> {
    return this._account$;
  }

  public get project$(): Observable<ProjectDto> {
    return this._project$;
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


  constructor(
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private accountApiService: AccountApiService,
    private message: NzMessageService,
  ) {
    this._account$
      .subscribe((account) => {
        if (!account) {
          this._project$.next(null);
          this._availableProjects.next([]);
          return;
        }
        this.accountApiService.getAccountProjectUsingGET(account.id)
          .pipe(
            take(1)
          ).subscribe(pms => {
          const projects = pms.map(pm => pm.project);
          this._availableProjects.next(projects);
          if (projects.length > 0) {
            this._project$.next(projects[0]);
          } else {
            message.error('No project is available for this account');
            this.removeToken();

          }
        });

      });

  }

  init() {
    if (this.isTokenExpired()) {
      this.removeToken();
    } else {
      this.writeToken(this.getToken());
    }
  }

  public get loginStatus$(): Observable<boolean> {
    return this._loginStatus$;
  }


  isTokenExpired(): boolean {
    const jwtStr = this.getToken();
    // console.log(jwtStr);
    if (jwtStr) {
      return this.jwtHelper.isTokenExpired(jwtStr);
    } else {
      return true;
    }
  }

  writeToken(value: string) {
    localStorage.setItem(LOCAL_TOKEN_KEY, value);
    this._loginStatus$.next(true);

    const tknObj = this.jwtHelper.decodeToken(value);
    this.accountApiService.getMeUsingGET().subscribe(account => {
      localStorage.setItem(LOCAL_ME, JSON.stringify(account));
      this._account$.next(account);
    });
  }

  getToken(): string {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }

  async removeToken() {
    if (this.getToken()) {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      localStorage.removeItem(LOCAL_ME);
    }
    this._loginStatus$.next(false);
    this._account$.next(null);
    try {
      await this.authService.signOut(true);
    } catch (err) {
      console.error(err);
    }

  }


  public getMe(): AccountDto {
    const accountJson = localStorage.getItem(LOCAL_ME);
    if (!accountJson) {
      return null;
    }
    return JSON.parse(accountJson);
  }

  public switchProject(project: ProjectDto) {
    this._project$.next(project);
  }


}
