import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzTabComponent} from 'ng-zorro-antd';

@Component({
  selector: 'app-holder-detail-address',
  templateUrl: './holder-detail-address.component.html',
  styleUrls: ['./holder-detail-address.component.scss']
})
export class HolderDetailAddressComponent implements OnInit {
  public holderId: string;
  public selectedTabIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.holderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  add() {
    this.router.navigate(['/holder-detail-address-add/' + this.holderId]);
  }

  handleSelectChange(val: { index: number, tab: NzTabComponent }) {
    this.selectedTabIndex = val.index;
    console.log(this.selectedTabIndex);
  }
}
