import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-name-space',
  templateUrl: './name-space.component.html',
  styleUrls: ['./name-space.component.scss']
})
export class NameSpaceComponent implements OnInit {

  listOfData: Array<any>;

  constructor() {
  }

  ngOnInit() {
    this.listOfData = [{
      'namespace': 'VIP',
      'status': 'Enabled'
    }];
  }

}
