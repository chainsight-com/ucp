import {Component, OnDestroy, OnInit} from '@angular/core';
import {from, interval, Subject} from "rxjs";
import {TblColumn} from "../../../shared/table/tbl-column";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, map, take, takeUntil} from "rxjs/operators";
import {TblAction} from "../../../shared/table/tbl-action";
import { AddressScanBatchDto, AddressScanBatchDtoStatusEnum, AddressScanDtoStatusEnum, ProjectDto } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-address-scan-batch-page',
  templateUrl: './address-scan-batch-page.component.html',
  styleUrls: ['./address-scan-batch-page.component.scss']
})
export class AddressScanBatchPageComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  public batchId: string;
  public columns: Array<TblColumn<AddressScanBatchDto>> = [
    {
      property: 'status',
      title: 'Status',
      type: 'level',
      width: 150,
      formatter: (row) => {
        return this.statusFormatter(row.status);
      }
    },
    {
      property: 'name',
      title: 'Name',
      detail: false
    },
    {
      title: 'Created Time',
      formatter: row => {
        return formatDate(row.createdTime, 'short', 'en-US', '');
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


  public page: Page<AddressScanBatchDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public totalElements = 1;
  public isLoading = false;
  public project: ProjectDto;

  constructor(
    private api: ApiService,
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
      this.pageIdx = 1;
    }
    if (!silent) {
      this.isLoading = true;
    }
    from(this.api.addressScanBatchApi.paginateAddressScanBatchUsingGET(this.pageIdx-1, this.pageSize, this.userService.project.id))
      .pipe(
        take(1),
        map(resp => resp.data)
      ).subscribe(page => {
      this.page = page;
      this.totalElements = Number(page.totalElements);
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

  handleActionClick(val: TblAction<AddressScanBatchDto>) {
    const row: AddressScanBatchDto = val.row;
    switch (val.action) {
      case 'view':
        this.router.navigate(['address-scan'], {queryParams: {batchId: row.id}});
        break;
      default:
        break;
    }
  }

  statusFormatter(status: AddressScanBatchDtoStatusEnum) {

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
