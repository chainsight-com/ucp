import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-holder-detail-address',
  templateUrl: './holder-detail-address.component.html',
  styleUrls: ['./holder-detail-address.component.scss']
})
export class HolderDetailAddressComponent implements OnInit {
  holderId: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.holderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

}
