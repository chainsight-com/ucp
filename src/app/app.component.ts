import { Component, AfterViewInit, OnInit } from '@angular/core';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private jwtService: JwtService) {

  }

  ngOnInit(): void {
    this.jwtService.init();
  }

  title = 'unblock-ui';
}
