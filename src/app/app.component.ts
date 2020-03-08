import {Component, OnInit} from '@angular/core';
import {AccountApiService, ProjectMemberDto} from '@profyu/unblock-ng-sdk';
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

  tag: ProjectMemberDto;
  infoList: Array<ProjectMemberDto>;
  user: User = new User();


  ngOnInit(): void {
  }
}
