import {Component, OnInit} from '@angular/core';
import {AccountApiService, ProjectAccountDto} from '@profyu/unblock-ng-sdk';
import {User} from './models/user';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private accountApiService: AccountApiService) {
  }

  tag: ProjectAccountDto;
  infoList: Array<ProjectAccountDto>;
  user: User = new User();

  ngOnInit() {
  }

  handleInfoClick(item) {
    this.tag = item;
  }

  handleUserChange(user) {
    this.user = user;
    console.log(this.user);
    if (!!this.user) {
      this.accountApiService.getAccountProjectUsingGET(this.user.id).pipe(
        take(1),
      ).subscribe(res => {
        console.log(res);
        this.infoList = res;
        if (!!this.infoList && this.infoList.length > 0) {
          this.tag = this.infoList[0];
        }
      }, console.error, () => {
      });
    }
  }
}
