import {Component, OnDestroy, OnInit} from '@angular/core';
import {TblAction, TblColumn} from '@profyu/core-ng-zorro';
import {HolderGroupApiService, HolderGroupDto, ProjectApiService} from '@profyu/unblock-ng-sdk';
import {Subject} from 'rxjs';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {takeUntil} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-flow-labeling',
  templateUrl: './flow-labeling.component.html',
  styleUrls: ['./flow-labeling.component.scss']
})
export class FlowLabelingComponent implements OnInit, OnDestroy {

  public listOfData: Array<any> = [
    {
      'status': 1,
      'currency': 'BTC',
      'label': 'sanction',
      'maxLevel': 3,
      'startedTime': '2011-10-12T00:01:10.000+0000',
      'endedTime': '2019-12-01T07:57:28.000+0000'
    },
    {
      'status': 2,
      'currency': 'ZIL',
      'label': 'sanction',
      'maxLevel': 4,
      'startedTime': '2011-10-12T00:01:10.000+0000',
      'endedTime': '2019-12-01T07:57:28.000+0000'
    },
    {
      'status': 1,
      'currency': 'ETH',
      'label': 'sanction',
      'maxLevel': 3,
      'startedTime': '2011-10-12T00:01:10.000+0000',
      'endedTime': '2019-12-01T07:57:28.000+0000'
    }
  ];
  public isLoading = false;
  public currentPage = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public tblColumns: Array<TblColumn<any>> = [
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
      title: 'Currency'
    },
    {
      property: 'label',
      title: 'Label'
    },
    {
      property: 'maxLevel',
      title: 'MaxLevel'
    },
    {
      property: '',
      title: 'Started Time',
      formatter: data => {
        return this.utilService.transformDateShort(data.startedTime);
      }
    },
    {
      property: '',
      title: 'Ended Time',
      formatter: data => {
        return this.utilService.transformDateShort(data.endedTime);
      }
    }
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private userService: UserService,
              private utilService: UtilsService) {
  }

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      console.log(project);
      if (!!project) {
        // this.projectApiService.getProjectHolderGroupsUsingGET(project.id, this.currentPage, this.pageSize).subscribe(x => {
        //   this.listOfData = x.content;
        //   this.total = x.totalElements;
        // });
      }
    });
  }

  reload() {
    // this.projectApiService.getProjectHolderGroupsUsingGET(
    //   this.userService.project$.getValue().id,
    //   this.currentPage, this.pageSize
    // ).subscribe(x => {
    //   this.listOfData = x.content;
    //   this.total = x.totalElements;
    // });
  }

  addFlowLabeling() {
    this.router.navigate(['/flow-labeling-add']);
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

  levelFormatter(data) {
    let res = null;
    switch (data) {
      case 1:
        res = {
          color: 'green',
          title: 'Completed'
        };
        break;
      case 2:
        res = {
          color: 'blue',
          title: 'Running'
        };
        break;
      default:
        res = {
          color: 'yellow',
          title: 'N/A'
        };
    }
    return res;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
