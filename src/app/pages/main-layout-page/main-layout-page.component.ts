import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout-page',
  templateUrl: './main-layout-page.component.html',
  styleUrls: ['./main-layout-page.component.scss']
})
export class MainLayoutPageComponent implements OnInit {

  public isSideBarCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
