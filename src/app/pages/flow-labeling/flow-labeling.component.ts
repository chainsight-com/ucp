import { Component, OnDestroy, OnInit } from '@angular/core';
import { TblAction, TblColumn } from '@profyu/core-ng-zorro';
import { HolderGroupApiService, HolderGroupDto, ProjectApiService, FlowLabelingDto } from '@profyu/unblock-ng-sdk';
import { Subject, Observable, interval } from 'rxjs';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-flow-labeling',
  templateUrl: './flow-labeling.component.html',
  styleUrls: ['./flow-labeling.component.scss']
})
export class FlowLabelingComponent implements OnInit, OnDestroy {

  public listOfData: Array<any> = [];
  public isLoading = false;
  public currentPage = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public tblColumns: Array<TblColumn<FlowLabelingDto>> = [
    {
      property: 'status',
      title: 'Status',
      type: 'level',
      width: 180,
      formatter: (data) => {
        return this.levelFormatter(data);
      }
    },
    {
      property: 'currency',
      title: 'Currency',
      formatter: (data) => {
        return data.currency.name.toUpperCase();
      }
    },
    {
      property: 'labelName',
      title: 'Label'
    },
    {
      property: 'maxLevel',
      title: 'Max Level'
    },
    {
      property: 'startingTime',
      title: 'Starting Time',
      formatter: data => {
        return this.utilService.transformDateShort(data.startingTime);
      }
    },
    {
      property: 'endingTime',
      title: 'Ending Time',
      formatter: data => {
        return this.utilService.transformDateShort(data.endingTime);
      }
    },
    {
      property: 'labeledAddresses',
      title: 'Labeled Addresses'
    },
  ];
  public unsubscribe$ = new Subject<void>();
  public projectId: number;

  constructor(private router: Router,
    private userService: UserService,
    private projectApiService: ProjectApiService,
    private utilService: UtilsService) {
  }

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      console.log(project);
      if (!!project) {
        this.projectId = project.id;
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
    if (!!this.projectId) {
      this.projectApiService.getProjectFlowLabelingUsingGET(
        this.projectId,
        this.currentPage, this.pageSize
      ).subscribe(x => {
        this.listOfData = x.content;
        this.total = x.totalElements;
      });
    }
  }

  addFlowLabeling() {
    this.router.navigate(['/flow-labeling-add']);
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

  levelFormatter(data: FlowLabelingDto.StatusEnum) {
    let res = null;
    switch (data) {
      case FlowLabelingDto.StatusEnum.COMPLETED:
        res = {
          color: 'green',
          title: 'Completed'
        };
        break;
      case FlowLabelingDto.StatusEnum.PENDING:
      case FlowLabelingDto.StatusEnum.RUNNING:

        res = {
          color: 'blue',
          title: 'Running'
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
