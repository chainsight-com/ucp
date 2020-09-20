import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from "rxjs";
import {TblColumn} from "../../../shared/table/tbl-column";
import {
  Address, AddressApiService,
  AddressCaseDto,
  AddressDetail, AddressScanBatchDto,
  HolderAddressApiService,
  HolderAddressDto
} from "@profyu/unblock-ng-sdk";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, take} from "rxjs/operators";
import {ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {RISK_LEVEL_MAP} from "../../../models/address-case-risk-level-option";
import {TblAction} from "../../../shared/table/tbl-action";

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss']
})
export class AddressTableComponent implements OnInit, OnChanges {

  @Input()
  public projectId: string;

  @Input()
  public addresses: Address[];

  private unsubscribe$ = new Subject<void>();
  public columns: Array<TblColumn<AddressDetail>> = [
    {
      title: 'Currency',
      formatter: (row) => {
        return row.currency.name.toUpperCase();
      }
    },
    {
      property: 'address',
      title: 'Address'
    },
    {
      title: 'Holder Name',
      formatter: (row) => {
        return !!row.holder ? row.holder.legalName : null;
      }
    },
    {
      title: 'Case Status',
      type: 'level',
      width: 150,
      formatter: (row) => {
        return !!row.addressCase ? this.caseStatusFormatter(row.addressCase.status) : null;
      }
    },
    {
      title: 'Case',
      detail: false,
      formatter: (row) => {
        return !!row.addressCase ? row.addressCase.title : null;
      }
    },
    {
      title: 'Risk Level',
      type: 'tag',
      formatter: (row) => {
        return !!row.addressCase ? this.caseLevelFormatter(row.addressCase.level) : null;
      }
    },
    {
      title: 'Action',
      actions: (data) => {
        const actions = [];
        if(!!data.addressCase){
          actions.push({name: 'goto-address-case', title: 'Case'});
        } else {
          actions.push({ name: 'create-address-case',  title: 'Create Case'});
        }
        if(!!data.holder){
          actions.push({name: 'goto-holder', title: 'Holder'});
        }
        return actions;
      }
    }
  ];

  public content: AddressDetail[] = [];
  public isLoading = false;



  constructor(
    private addressApiService: AddressApiService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.projectId || changes.addresses){
      if(this.projectId && this.addresses){
        this.reload(false);
      }
    }
  }



  reload(silent: boolean) {

    if (!silent) {
      this.isLoading = true;
    }
    const body = {
      addresses: this.addresses
    }
    this.addressApiService.listAddressDetailsUsingPOST(body, this.projectId)
      .pipe(
        take(1),
        finalize(() => {this.isLoading = false})
      ).subscribe(resp => {
      this.content = resp;
    }, console.error);
  }

  caseStatusFormatter(status: AddressCaseDto.StatusEnum) {
    const attr = ADDRESS_CASE_STATUS_MAP[status];
    if (!attr) {
      return {
        color: '#108ee9',
        title: 'default'
      };

    }
    return {
      color: attr.color,
      title: attr.label,
    };
  }

  caseLevelFormatter(level: AddressCaseDto.LevelEnum) {
    const attr = RISK_LEVEL_MAP[level];
    if (!attr) {
      return {
        color: '#108ee9',
        title: 'default'
      };

    }
    return {
      color: attr.color,
      title: attr.label,
    };
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleAction(val: TblAction<AddressDetail>) {
    console.log(val);
  }


}
