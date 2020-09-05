import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {
  AccountDto,
  AddressScanApiService, AddressScanDto, ProjectDto
} from '@profyu/unblock-ng-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, take, takeUntil} from 'rxjs/operators';
import {NzTabComponent} from 'ng-zorro-antd';
import {formatDate} from '@angular/common';
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {UserService} from "../../../services/user.service";
import {TblColumn} from "../../../shared/table/tbl-column";
import {interval, Subject} from "rxjs";

@Component({
  selector: 'app-address-scan-page',
  templateUrl: './address-scan-page.component.html',
  styleUrls: ['./address-scan-page.component.scss']
})
export class AddressScanPageComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  // filters
  @Input()
  public batchId: string;
  @Input()
  public currencyId: string;
  @Input()
  public address: string;


  public me: AccountDto;
  public columns: Array<TblColumn<any>> = [
    {
      property: 'status',
      title: 'Status',
      type: 'level',
      width: 150,
      formatter: (data) => {
        return this.statusFormatter(data);
      }
    },
    {
      property: 'currency',
      title: 'Currency',
      formatter: data => {
        return data.currency.name.toUpperCase();
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
      property: '',
      title: 'Time Range',
      formatter: data => {
        return formatDate(data.startingTime, 'short', 'en-US', '') + '-' +
          formatDate(data.endingTime, 'short', 'en-US', '');
      }
    },
    {
      property: '',
      title: 'Created Time',
      formatter: data => {
        return formatDate(data.createdTime, 'short', 'en-US', '');
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
  public project: ProjectDto;

  constructor(
    private addressScanApiService: AddressScanApiService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.me = this.userService.getMe();
    this.activatedRoute.queryParams
      .pipe(
        filter(params => params.batchId)
      )
      .subscribe(params => {
        this.batchId = params.batchId;
      });
    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((project) => {
        this.project = project;
        if (project) {
          this.reload(true, false);
        }

      });
    interval(5000)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(
      data => {
        if (this.userService.project) {
          this.reload(false, true);
        }

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
    this.addressScanApiService.paginateAddressScanUsingGET(this.pageIdx - 1, this.pageSize, this.userService.project.id, this.batchId, this.currencyId, this.address)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
      this.totalElements = Number(page.totalElements);
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  addScan() {
    const query: any = {};
    if (this.currencyId) {
      query.currencyId = this.currencyId;
    }
    if (this.address) {
      query.address = this.address
    }

    this.router.navigate(['/address-scan/create'], {
      queryParams: query
    });
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false, false);
  }

  handleDetailClick(row) {
    this.router.navigate(['address-scan', row.id]);
  }

  statusFormatter(data) {

    let res = null;
    switch (data) {
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
      case 'TIMEOUT':
        res = {
          color: 'red',
          title: 'Timeout'
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

  ngOnChanges(changes) {
    if (changes.batchId || changes.currencyId || changes.address) {
      this.reload(true, false)
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
