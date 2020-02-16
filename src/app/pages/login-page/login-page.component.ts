import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil, take, map, filter, switchMap, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthApiService, TokenPair, GoogleOAuthCredential, AccountCredentials } from '@profyu/unblock-ng-sdk';
import { merge } from 'd3';
import { JwtService } from 'src/app/services/jwt.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {


  private unsubscribe$ = new Subject<void>();
  validateForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private authApiService: AuthApiService,
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private messageService: NzMessageService) {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],

    });
  }

  ngOnInit() {

    this.jwtService.loginStatus$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/new-scan');
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


  loginWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  login() {
    const formValue = this.validateForm.value;

    const body: AccountCredentials = {
      email: formValue.email,
      password: formValue.password
    };

    this.authApiService.authenticateUsingPOSTDefault(body)
      .pipe(
        take(1)
      ).subscribe(tokenPair => {
        this.jwtService.writeToken(tokenPair.token);
      }, (err) => {
        console.error(err);
      });
  }

}
