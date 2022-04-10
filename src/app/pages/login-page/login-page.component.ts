import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, GoogleLoginProvider} from "angularx-social-login";
import {filter, map, mergeMap, take, takeUntil, tap} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd";
import {from, Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import { ApiService } from 'src/app/services/api.service';
import { AccountCredentials } from '@chainsight/unblock-api-axios-sdk';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public isSpinning: boolean = false;
  validateForm: FormGroup;

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private message: NzMessageService,
    private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],

    });
  }

  ngOnInit() {
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
      mergeMap((cred) => from(this.api.authApi.authenticateWithGoogle(cred))),
      map(resp => resp.data)
    ).subscribe((tokenPair) => {
      this.userService.signIn(tokenPair.token);
    });



    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(project => {
      if (project != null) {
        this.router.navigate(['dashboard']);
      }
    });
  }

  login() {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }
    const formValue = this.validateForm.value;
    const body: AccountCredentials = {
      email: formValue.email,
      password: formValue.password
    };
    this.isSpinning = true;
    from(this.api.authApi.authenticate(body))
      .pipe(
        take(1),
        map(resp => resp.data)
      ).subscribe(
      (tokenPair) => {
        this.userService.signIn(tokenPair.token);
      }, (error) => {
        console.log(error);
        this.message.error(`<span class="pfy-message-error">${error.message}</span>`);
      },
      () => {
        this.isSpinning = false;
      });


  }

  loginWithGoogle() {
    this.validateForm.reset();
    this.isSpinning = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .catch(reason => {
        console.log(reason);
        this.isSpinning = false;
      });


  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
