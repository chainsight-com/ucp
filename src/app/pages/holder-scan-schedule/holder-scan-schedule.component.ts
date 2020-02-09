import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-holder-scan-schedule',
  templateUrl: './holder-scan-schedule.component.html',
  styleUrls: ['./holder-scan-schedule.component.scss']
})
export class HolderScanScheduleComponent implements OnInit {

  listOfData: Array<any>;

  constructor() {
  }

  ngOnInit() {
    this.listOfData = [{
      'name': '#00003',
      'status': 'Enabled',
      'nextScanAt': '2020-01-01'
    }];
  }

}
