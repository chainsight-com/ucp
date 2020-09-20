import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  Address,
  AddressCaseApiService,
  AddressCaseDto,
  HolderApiService,
  HolderDto,
  PageOfHolderAddressDto
} from "@profyu/unblock-ng-sdk";
import {filter, map, take} from "rxjs/operators";
import {RISK_LEVEL_MAP} from "../../../models/holder-risk-level-option";

@Component({
  selector: 'app-cluster-info',
  templateUrl: './cluster-info.component.html',
  styleUrls: ['./cluster-info.component.scss']
})
export class ClusterInfoComponent implements OnInit, OnChanges {

  @Input()
  public projectId: string;
  @Input()
  public clusterId: string;
  @Input()
  public addresses: Address[] = [];
  @Input()
  public tags: Array<{ tag: string, score: number }>


  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }


}
