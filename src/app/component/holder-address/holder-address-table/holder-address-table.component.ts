import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from "rxjs";
import {
  AccountDto,
  AddressCaseApiService,
  AddressCaseDto,
  HolderAddressApiService,
  HolderAddressDto,
  ProjectDto
} from "@profyu/unblock-ng-sdk";
import {TblColumn} from "../../../shared/table/tbl-column";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, take, takeUntil} from "rxjs/operators";
import {ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {RISK_LEVEL_MAP} from "../../../models/address-case-risk-level-option";

@Component({
  selector: 'app-holder-address-table',
  templateUrl: './holder-address-table.component.html',
  styleUrls: ['./holder-address-table.component.scss']
})
export class HolderAddressTableComponent implements OnInit, OnChanges {

  private unsubscribe$ = new Subject<void>();
  public batchId: string;
  public me: AccountDto;
  public columns: Array<TblColumn<any>> = [
    {
      property: 'currency',
      title: 'Currency',
      formatter: (data: HolderAddressDto) => {
        return (data as any).currency.name.toUpperCase();
      },
      detail: false
    },
    {
      property: 'address',
      title: 'Address',
      detail: true
    },
    {
      title: 'Case Status',
      type: 'level',
      width: 150,
      formatter: (data: HolderAddressDto) => {
        return !!data.addressCase ? this.caseStatusFormatter(data.addressCase.status) : null;
      }
    },
    {
      title: 'Title',
      detail: false,
      formatter: (data: HolderAddressDto) => {
        return !!data.addressCase ? data.addressCase.title : null;
      }
    },
    {
      title: 'Risk Level',
      type: 'tag',
      formatter: (data: HolderAddressDto) => {
        return !!data.addressCase ? this.caseLevelFormatter(data.addressCase.level) : null;
      }
    },
    {
      title: 'Action',
      actions: (data: HolderAddressDto) => {
        return !!data.addressCase ? [{name: 'goto-address-case', title: 'View'}] : [{name: 'create-address-case', title: 'Create Case'}]
    }
    }
  ];


  public page: Page<HolderAddressDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public totalElements = 1;
  public isLoading = false;

  @Input()
  public holderId: string;

  constructor(
    private holderAddressApiService: HolderAddressApiService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.holderId && changes.holderId.currentValue) {
      this.reload(true, false);
    }
  }

  reload(reset: boolean, silent: boolean) {

    if (reset) {
      this.pageIdx = 1;
    }
    if (!silent) {
      this.isLoading = true;
    }
    this.holderAddressApiService.paginateHolderAddressAddressUsingGET(this.pageIdx - 1, this.pageSize, null, this.holderId)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
      this.totalElements = Number(page.totalElements);
    }, console.error, () => {
      this.isLoading = false;
    });
  }


  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false, false);
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

  handleDetailClick(row) {
    if(row.addressCase){
      this.router.navigate(['address-case', row.addressCase.id]);
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
