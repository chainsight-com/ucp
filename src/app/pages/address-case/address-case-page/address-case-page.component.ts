import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AccountDto, AddressCaseApiService, AddressCaseDto,
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
import {RISK_LEVEL_MAP} from "../../../models/address-case-risk-level-option";
import {ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";

@Component({
  selector: 'app-address-case-page',
  templateUrl: './address-case-page.component.html',
  styleUrls: ['./address-case-page.component.scss']
})
export class AddressCasePageComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  public batchId: string;
  public me: AccountDto;
  public columns: Array<TblColumn<AddressCaseDto>> = [
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
      property: 'title',
      title: 'Title',
      detail: true
    },
    {
      property: 'currency',
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
      property: 'level',
      title: 'Risk Level',
      type: 'tag',
      formatter: (row) => {
        return this.levelFormatter(row.level);
      }
    },
    {
      title: 'Created Time',
      formatter: row => {
        return formatDate(row.createdTime, 'short', 'en-US', '');
      }
    }
  ];


  public page: Page<AddressCaseDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public totalElements = 1;
  public isLoading = false;
  public project: ProjectDto;

  constructor(
    private addressCaseApiService: AddressCaseApiService,
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
  }


  reload(reset: boolean, silent: boolean) {

    if (reset) {
      this.pageIdx = 1;
    }
    if(!silent){
      this.isLoading = true;
    }
    this.addressCaseApiService.paginateAddressCaseUsingGET(this.pageIdx-1, this.pageSize, this.userService.project.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
      this.totalElements = Number(page.totalElements);
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  addCase() {
    this.router.navigate(['/address-case/create']);
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false, false);
  }

  handleDetailClick(row) {
    this.router.navigate(['address-case', row.id]);
  }

  statusFormatter(status:  AddressCaseDto.StatusEnum) {

    const attr = ADDRESS_CASE_STATUS_MAP[status];
    if(!attr){
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
  levelFormatter(level: AddressCaseDto.LevelEnum) {
    const attr = RISK_LEVEL_MAP[level];
    if(!attr){
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

}
