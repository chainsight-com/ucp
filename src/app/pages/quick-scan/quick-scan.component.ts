import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-quick-scan',
  templateUrl: './quick-scan.component.html',
  styleUrls: ['./quick-scan.component.scss']
})
export class QuickScanComponent implements OnInit {
  tabs: Array<{ name: string }> = [
    {name: 'BTC'},
    {name: 'ETH'},
    {name: 'BCH'},
    {name: 'LTC'},
    {name: 'USDT'},
    {name: 'ZIL'}];

  selectedTab = this.tabs[0]['name'];

  constructor() {
  }

  ngOnInit(): void {
  }

  clickTab(args: any[]): void {
    console.log(args);
    this.selectedTab = args[1]['name'];
  }


}
