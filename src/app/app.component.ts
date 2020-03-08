import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountApiService, ProjectDto} from '@profyu/unblock-ng-sdk';
import {User} from './models/user';
import {take, takeUntil} from 'rxjs/operators';
import {UserService} from './services/user.service';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private accountApiService: AccountApiService,
              private userService: UserService) {
  }

  tag: ProjectDto;
  infoList: Array<ProjectDto>;
  user: User = new User();
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      this.tag = project;
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
