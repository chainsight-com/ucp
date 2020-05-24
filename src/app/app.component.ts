import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LayoutComponent} from "./shared/layout/layout.component";
import {UserService} from "./services/user.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {
    this.userService.init();
  }

  @ViewChild(LayoutComponent, {static: false})
  private layoutCompo: LayoutComponent;

  ngOnInit() {

  }

  ngOnDestroy(): void {
  }


}
