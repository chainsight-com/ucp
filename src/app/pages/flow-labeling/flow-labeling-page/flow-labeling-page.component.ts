import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Observable, interval, from} from 'rxjs';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {takeUntil, switchMap, take, map} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {UtilsService} from '../../../services/utils.service';
import {TblColumn} from "../../../shared/table/tbl-column";
import { FlowLabelingDto, FlowLabelingDtoStatusEnum, ProjectDto } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-flow-labeling-page',
  templateUrl: './flow-labeling-page.component.html',
  styleUrls: ['./flow-labeling-page.component.scss']
})
export class FlowLabelingPageComponent implements OnInit, OnDestroy {

  public listOfData: Array<any> = [];
  public isLoading = false;
  public pageIndex: number = 1;
  public totalElements: number = 1;
  public pageSizeOptions = [30, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public tblColumns: Array<TblColumn<FlowLabelingDto>> = [
    {
      property: 'status',
      title: 'Status',
      type: 'level',
      width: 180,
      formatter: (row) => {
        return this.levelFormatter(row.status);
      }
    },
    {
      property: 'currency',
      title: 'Currency',
      formatter: (row) => {
        return row.currency.name.toUpperCase();
      }
    },
    {
      property: 'labelId',
      title: 'Label'
    },
    {
      property: 'forwardMaxLevel',
      title: 'Forward LV'
    },
    {
      property: 'backwardMaxLevel',
      title: 'Backward LB'
    },
    {
      property: 'startingTime',
      title: 'Starting Time',
      formatter: row => {
        return this.utilService.transformDateShort(new Date(row.startingTime));
      }
    },
    {
      property: 'endingTime',
      title: 'Ending Time',
      formatter: row => {
        return this.utilService.transformDateShort(new Date(row.endingTime));
      }
    },
    {
      property: 'labeledAddresses',
      title: 'Labeled Addresses'
    },
  ];
  public unsubscribe$ = new Subject<void>();
  public project: ProjectDto;

  constructor(private router: Router,
              private userService: UserService,
              private api: ApiService,
              private utilService: UtilsService) {
  }

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      this.project = project;
      if (!!project) {
        this.reload();
      }
    });

    interval(5000)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(
      data => {
        this.reload();
      }
    );
  }

  reload() {
    if (!!this.project) {
      from(this.api.projectApi.getProjectFlowLabeling(
        this.project.id,
        this.pageIndex - 1, this.pageSize
      ))
      .pipe(
        map(resp => resp.data)
      )
      .subscribe(x => {
        this.listOfData = x.content;
        this.totalElements = x.totalElements;
      });
    }
  }

  addFlowLabeling() {
    this.router.navigate(['/flow-labeling-page', 'create']);
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

  levelFormatter(data: FlowLabelingDtoStatusEnum) {
    let res = null;
    switch (data) {
      case 'PENDING':
      case 'SUBMITTED':
        res = {
          color: 'yellow',
          title: 'Submitted'
        };
        break;
      case 'COMPLETED':
        res = {
          color: 'green',
          title: 'Completed'
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
          color: 'yellow',
          title: 'Unknown'
        };
    }
    return res;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
