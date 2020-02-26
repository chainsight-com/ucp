import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-holder-scan-schedule-add',
  templateUrl: './holder-scan-schedule-add.component.html',
  styleUrls: ['./holder-scan-schedule-add.component.scss']
})
export class HolderScanScheduleAddComponent implements OnInit {
  public name = '';
  public radioValue = '';
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  constructor() {
  }

  ngOnInit() {
  }

  onValueChange(value: Date): void {
    console.log(`Current value: ${value}`);
  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log(`Current value: ${change.date}`);
    console.log(`Current mode: ${change.mode}`);
  }
}
