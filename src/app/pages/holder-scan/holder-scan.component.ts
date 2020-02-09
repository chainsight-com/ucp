import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-holder-scan',
  templateUrl: './holder-scan.component.html',
  styleUrls: ['./holder-scan.component.scss']
})
export class HolderScanComponent implements OnInit {

  listOfData: Array<any>;

  constructor() {
  }

  ngOnInit() {
    this.listOfData = [{
      'id': '#00003',
      'status': 'Running',
      'startAt': '2020-01-01'
    }];
  }
}
