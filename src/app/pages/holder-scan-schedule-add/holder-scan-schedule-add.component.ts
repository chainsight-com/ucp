import {Component, OnInit} from '@angular/core';
import {TransferItem} from 'ng-zorro-antd';

@Component({
  selector: 'app-holder-scan-schedule-add',
  templateUrl: './holder-scan-schedule-add.component.html',
  styleUrls: ['./holder-scan-schedule-add.component.scss']
})
export class HolderScanScheduleAddComponent implements OnInit {
  public name = '';
  public radioValue = '';
  public listOfControl: Array<{ id: number; controlInstance: string }> = [];

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  list: TransferItem[] = [];

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.list.push({
        key: i.toString(),
        title: `content${i + 1}`,
        disabled: false
      });
    }

    [2, 3].forEach(idx => (this.list[idx].direction = 'right'));
  }

  onValueChange(value: Date): void {
    console.log(`Current value: ${value}`);
  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log(`Current value: ${change.date}`);
    console.log(`Current mode: ${change.mode}`);
  }
  transferSelect(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  transferChange(ret: {}): void {
    console.log('nzChange', ret);
  }
}
