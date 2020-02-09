import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss']
})
export class HolderComponent implements OnInit {

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
