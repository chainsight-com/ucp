import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route, Router } from '@angular/router';
import { User } from '../model/user';
import { JwtService } from '../jwt.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public user: User;
  public keyword: string;
  public maxDist: number = 5;
  private unsubscribe$ = new Subject<void>();
  constructor(protected router: Router, private jwtService: JwtService, private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.authState.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(auth => {
      if(!auth) {
        this.jwtService.removeToken();
        this.router.navigateByUrl('/login');
      }
    });
    this.jwtService.currentUser$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  search() {
    this.router.navigateByUrl('/result/' + this.keyword + '/' + this.maxDist);
  }
  async onBack() {
    await this.authService.signOut();
  }

}
