import {Component, Input, OnInit} from '@angular/core';
import {TagWithScore} from "@profyu/unblock-ng-sdk";

@Component({
  selector: 'app-scored-tag',
  templateUrl: './scored-tag.component.html',
  styleUrls: ['./scored-tag.component.scss']
})
export class ScoredTagComponent implements OnInit {

  @Input()
  public tags: TagWithScore[];

  constructor() { }

  ngOnInit() {
  }

}
