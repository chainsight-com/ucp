import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "angularx-social-login";

@Component({
  selector: 'app-not-authorized-page',
  templateUrl: './not-authorized-page.component.html',
  styleUrls: ['./not-authorized-page.component.scss']
})
export class NotAuthorizedPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    await this.userService.signOut();
  }

}
