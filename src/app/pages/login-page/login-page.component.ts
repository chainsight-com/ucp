import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil, take, map, filter, switchMap, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthApiService, TokenPair, GoogleOAuthCredential } from 'src/sdk';
import { merge } from 'd3';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {


  private unsubscribe$ = new Subject<void>();
  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private authApiService: AuthApiService, private httpClient: HttpClient, private jwtService: JwtService, private router: Router) {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  ngOnInit() {

    this.jwtService.loginStatus$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/main-layout/new-scan');
      }
    });

    this.authService.authState.pipe(
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
      mergeMap((cred) => this.authApiService.authenticateWithGoogleUsingPOSTDefault(cred))
    ).subscribe((tokenPair) => {
      this.jwtService.writeToken(tokenPair.token);
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
