import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout-page',
  templateUrl: './main-layout-page.component.html',
  styleUrls: ['./main-layout-page.component.scss']
})
export class MainLayoutPageComponent implements OnInit {

  public isSideBarCollapsed = false;

  constructor(private jwtService: JwtService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.jwtService.removeToken();
    this.authService.signOut(true);
    this.router.navigateByUrl('/login');
  }

}
