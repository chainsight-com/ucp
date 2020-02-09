import {Component, OnInit} from '@angular/core';
import {JwtService} from 'src/app/services/jwt.service';
import {AuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-main-layout-page',
  templateUrl: './main-layout-page.component.html',
  styleUrls: ['./main-layout-page.component.scss']
})
export class MainLayoutPageComponent implements OnInit {

  public isSideBarCollapsed = false;
  public user: User;

  constructor(private jwtService: JwtService, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    const res = this.jwtService.getMe();
    console.log(res);
    this.user = new User();
    this.user.displayName = res.firstName;
    this.user.email = res.email;
  }

  async logout() {
    this.jwtService.removeToken();
    try {
      await this.authService.signOut(true);
    } catch (err) {
      console.error(err);
    }


    this.router.navigateByUrl('/login');
  }

}
