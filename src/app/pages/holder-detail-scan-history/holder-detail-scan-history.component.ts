import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-holder-detail-scan-history',
  templateUrl: './holder-detail-scan-history.component.html',
  styleUrls: ['./holder-detail-scan-history.component.scss']
})
export class HolderDetailScanHistoryComponent implements OnInit {

  holderId: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.holderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

}
