import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TblColumn} from "../../../shared/table/tbl-column";
import {AddressScanApiService, AddressScanDto} from "@profyu/unblock-ng-sdk";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {Router} from "@angular/router";
import {filter, take, takeUntil} from "rxjs/operators";
import {interval, Subject} from "rxjs";

@Component({
  selector: 'app-address-scan-table',
  templateUrl: './address-scan-table.component.html',
  styleUrls: ['./address-scan-table.component.scss']
})
export class AddressScanTableComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input()
  public autoReload: boolean = false;
  @Input()
  public projectId: string;
  @Input()
  public incidentId: string;
  @Input()
  public batchId: string;
  @Input()
  public currencyId: string;
  @Input()
  public address: string;

  @Output()
  public detailClick: EventEmitter<AddressScanDto> = new EventEmitter<AddressScanDto>();


  public columns: Array<TblColumn<AddressScanDto>> = [
    {
      title: 'Status',
      type: 'level',
      width: 150,
      formatter: (row) => {
        return this.statusFormatter(row.status);
      }
    },
    {
      title: 'Currency',
      formatter: row => {
        return row.currency.name.toUpperCase();
      },
      detail: false
    },
    {
      property: 'address',
      title: 'Address',
      detail: true
    },
    {
      property: 'forwardMaxLevel',
      title: 'Forward LV',
    },
    {
      property: 'backwardMaxLevel',
      title: 'Backward LV'
    },
    {
      title: 'Time Range',
      formatter: row => {
        return formatDate(row.startingTime, 'short', 'en-US', '') + '-' +
          formatDate(row.endingTime, 'short', 'en-US', '');
      }
    },
    {
      title: 'Created Time',
      formatter: row => {
        return formatDate(row.createdTime, 'short', 'en-US', '');
      }
    },
    {
      property: 'riskCriticalCount',
      title: 'Cirtical Risks'
    },
    {
      property: 'riskHighCount',
      title: 'High Risks'
    },
  ];


  public page: Page<AddressScanDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public totalElements = 1;
  public isLoading = false;

  constructor(private router: Router,
              private addressScanApiService: AddressScanApiService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectId || changes.incidentId || changes.batchId || changes.currencyId || changes.address) {
      this.reload(true, false);
    }
  }

  ngOnInit() {
    interval(5000)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(d => this.autoReload)
      ).subscribe(
      data => {
        this.reload(false, true);
      }
    );
  }

  reload(reset: boolean, silent: boolean) {
    if (reset) {
      this.pageIdx = 1;
    }
    if (!silent) {
      this.isLoading = true;
    }
    this.addressScanApiService.paginateAddressScanUsingGET(this.pageIdx - 1, this.pageSize, this.projectId, this.batchId, this.currencyId, this.address, this.incidentId)
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

  handleDetailClick(row: AddressScanDto) {
    this.detailClick.emit(row);
  }


  statusFormatter(status: AddressScanDto.StatusEnum) {

    let res = null;
    switch (status) {
      case 'COMPLETED':
        res = {
          color: '#52c41a',
          title: 'Success'
        };
        break;
      case 'PENDING':
        res = {
          color: 'yellow',
          title: 'Pending'
        };
        break;
      case 'SUBMITTED':
        res = {
          color: 'yellow',
          title: 'Submitted'
        };
        break;
      case 'RUNNING':
        res = {
          color: 'blue',
          title: 'Running'
        };
        break;
      case 'FAILED':
        res = {
          color: 'red',
          title: 'Error'
        };
        break;
      default:
        res = {
          color: '#108ee9',
          title: 'default'
        };
    }
    return res;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
