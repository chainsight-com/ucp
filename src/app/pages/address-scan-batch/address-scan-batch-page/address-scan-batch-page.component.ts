import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subject} from "rxjs";
import {
  AccountDto,
  AddressScanApiService,
  AddressScanBatchApiService,
  AddressScanBatchDto,
  AddressScanDto, ProjectDto
} from "@profyu/unblock-ng-sdk";
import {TblColumn} from "../../../shared/table/tbl-column";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, take, takeUntil} from "rxjs/operators";
import {TblAction} from "../../../shared/table/tbl-action";

@Component({
  selector: 'app-address-scan-batch-page',
  templateUrl: './address-scan-batch-page.component.html',
  styleUrls: ['./address-scan-batch-page.component.scss']
})
export class AddressScanBatchPageComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  public batchId: string;
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
      property: 'name',
      title: 'Name',
      detail: false
    },
    {
      property: '',
      title: 'Created Time',
      formatter: data => {
        return formatDate(data.createdTime, 'short', 'en-US', '');
      }
    },
    {
      title: 'Actions',
      actions: [
        {
          name: 'view',
          title: 'View',
        }
      ]
    }
  ];


  public page: Page<AddressScanDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public isLoading = false;
  public project: ProjectDto;

  constructor(
    private addressScanBatchApiService: AddressScanBatchApiService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
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
        this.reload(false, true);
      }
    );
  }


  reload(reset: boolean, silent: boolean) {

    if (reset) {
      this.pageIdx = 0;
    }
    if (!silent) {
      this.isLoading = true;
    }
    this.addressScanBatchApiService.paginateAddressScanBatchUsingGET(this.pageIdx, this.pageSize, this.userService.project.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  addBatch() {
    this.router.navigate(['address-scan-batch','create']);
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false, false);
  }

  handleDetailClick(row: AddressScanBatchDto) {
  }

  handleActionClick(val: TblAction) {
    const row: AddressScanBatchDto = val.row;
    switch (val.action) {
      case 'view':
        this.router.navigate(['address-scan'], {queryParams: {batchId: row.id}});
        break;
      default:
        break;
    }
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
      case 'RUNNING':
        res = {
          color: 'blue',
          title: 'Running'
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