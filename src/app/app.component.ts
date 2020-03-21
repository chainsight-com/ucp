import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountApiService, AuthApiService, ProjectDto} from '@profyu/unblock-ng-sdk';
import {User} from './models/user';
import {filter, map, mergeMap, take, takeUntil, tap} from 'rxjs/operators';
import {UserService} from './services/user.service';
import {Subject} from 'rxjs';
import {LayoutComponent} from '@profyu/core-ng-zorro';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {JwtService} from './services/jwt.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private accountApiService: AccountApiService,
              private userService: UserService,
              private jwtService: JwtService,
              private authService: AuthService,
              private authApiService: AuthApiService,
              private router: Router,
              private message: NzMessageService) {
  }

  tag: ProjectDto;
  infoList: Array<ProjectDto>;
  user: User = new User();
  isSpinning = true;
  loginPopup = true;
  islogout = false;
  private unsubscribe$ = new Subject<void>();
  @ViewChild(LayoutComponent, {static: false}) private layoutCompo: LayoutComponent;

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      this.tag = project;
    });
    this.jwtService.loginStatus$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.loginPopup = false;
        const res = this.jwtService.getMe();
        this.user.displayName = res.firstName;
        this.user.email = res.email;
        this.user.id = res.id;
        this.handleUserChange(this.user);
      }
    });
    this.authService.authState.pipe(
      tap(user => {
        if (!user) {
          this.isSpinning = false;
        }
      }),
      takeUntil(this.unsubscribe$),
      filter(user => !!user),
      map(user => {
        return {
          userId: user.id,
          token: user.idToken,
          email: user.email,
          displayName: user.name,
        };
      }),
      mergeMap((cred) => this.authApiService.authenticateWithGoogleUsingPOST(cred))
    ).subscribe((tokenPair) => {
      this.jwtService.writeToken(tokenPair.token);
    });
  }

  handleInfoClick(item) {
    this.userService.project$.next(item);
  }


  handleUserChange(user) {
    this.user = user;
    // console.log(this.user);
    if (!!this.user) {
      this.accountApiService.getAccountProjectUsingGET(this.user.id).pipe(
        take(1),
      ).subscribe(res => {
        console.log(res);
        this.infoList = res.map(item => item.project);
        if (!!this.infoList && this.infoList.length > 0) {
          this.userService.project$.next(this.infoList[0]);
        }
      }, console.error, () => {
      });
    }
  }

// login, logout
  loginWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .catch(reason => {
        // console.log(reason);
        this.isSpinning = false;
      }).finally(() => {
    });
  }

  handleLoginClick(body) {

    if (!!body) {
      this.isSpinning = true;
      this.authApiService.authenticateUsingPOST(body)
        .pipe(
          take(1),
          // catchError((err, caught) => err),
        ).subscribe(
        (tokenPair) => {
          this.jwtService.writeToken(tokenPair.token);
          this.isSpinning = false;
        }, (error) => {
          console.log(error);
          this.message.error(`<span class="pfy-message-error">${error.message}</span>`);
          this.isSpinning = false;
        },
        () => {
        });
    }
  }

  async handleLogoutClick() {
    this.jwtService.removeToken();
    try {
      await this.authService.signOut(true);
    } catch (err) {
      console.error(err);
    }
    this.router.navigateByUrl('/');
    this.islogout = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
