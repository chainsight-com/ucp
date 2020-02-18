import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-quick-scan-add',
  templateUrl: './quick-scan-add.component.html',
  styleUrls: ['./quick-scan-add.component.scss']
})
export class QuickScanAddComponent implements OnInit {
  tabs = [
    {name: 'BTC'},
    {name: 'ETH'},
    {name: 'BCH'},
    {name: 'LTC'},
    {name: 'USDT'},
    {name: 'ZIL'}
  ];
  // tabs: Array<{ name: string }> = [
  //   {name: 'BTC'},
  //   {name: 'ETH'},
  //   {name: 'BCH'},
  //   {name: 'LTC'},
  //   {name: 'USDT'},
  //   {name: 'ZIL'}];

  selectedTab = this.tabs[0]['name'];

  constructor() {
  }

  ngOnInit(): void {
  }

  clickTab(args: any[]): void {
    console.log(args);
    this.selectedTab = args[1]['name'];
  }s

}
