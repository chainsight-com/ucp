import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TokenPair } from '../model/TokenPair';
import { environment } from 'src/environments/environment';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {


  private unsubscribe$ = new Subject<void>();
  constructor(private authService: AuthService, private httpClient: HttpClient, private jwtService: JwtService, private router: Router) { }

  ngOnInit() {

    this.jwtService.loginStatus$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
          this.router.navigateByUrl('/search');
      }
    });

    this.authService.authState.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user) => {

      const loggedIn = (user != null);
      if (loggedIn) {
        console.log(user);
        this.httpClient.post(environment.baseApiUrl + '/api/auth/authenticate/google', {
          userId: user.id,
          token: user.idToken,
          email: user.email,
          displayName: user.name,
        }).pipe(
          take(1)
        ).subscribe((tokenPair: TokenPair) => {
          this.jwtService.writeToken(tokenPair.token);
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  login() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

}
