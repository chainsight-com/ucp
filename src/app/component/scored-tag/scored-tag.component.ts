import {Component, Input, OnInit} from '@angular/core';
import {LabelWithRisk} from "@profyu/unblock-ng-sdk";

@Component({
  selector: 'app-scored-tag',
  templateUrl: './scored-tag.component.html',
  styleUrls: ['./scored-tag.component.scss']
})
export class ScoredTagComponent implements OnInit {

  @Input()
  public labels: LabelWithRisk[];

  constructor() { }

  ngOnInit() {
  }

}
