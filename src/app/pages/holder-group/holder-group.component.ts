import {Component, OnDestroy, OnInit} from '@angular/core';
import {TblAction, TblColumn} from '@profyu/core-ng-zorro';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {HolderGroupApiService, HolderGroupDto, ProjectApiService} from '@profyu/unblock-ng-sdk';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-holder-group',
  templateUrl: './holder-group.component.html',
  styleUrls: ['./holder-group.component.scss']
})
export class HolderGroupComponent implements OnInit, OnDestroy {

  public listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public tblColumns: Array<TblColumn<HolderGroupDto>> = [
    {
      property: 'name',
      title: 'Holder Group'
    },
    {
      property: 'enabled',
      title: 'Status'
    },
    {
      title: 'Action',
      actions: [
        {
          name: 'edit',
          title: 'Edit'
        },
        {
          name: 'delete',
          title: 'Delete'
        }

      ]
    }
  ];
  private unsubscribe$ = new Subject<void>();
  confirmModal: NzModalRef;

  constructor(private router: Router,
              private userService: UserService,
              private projectApiService: ProjectApiService,
              private holderGroupApiService: HolderGroupApiService,
              private message: NzMessageService,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      console.log(project);
      if (!!project) {
        this.projectApiService.getProjectHolderGroupsUsingGET(project.id, this.currentPage, this.pageSize).subscribe(x => {
          this.listOfData = x.content;
          this.total = x.totalElements;
        });
      }
    });
  }

  reload() {
    this.projectApiService.getProjectHolderGroupsUsingGET(
      this.userService.project$.getValue().id,
      this.currentPage, this.pageSize
    ).subscribe(x => {
      this.listOfData = x.content;
      this.total = x.totalElements;
    });
  }

  addHolderGroup() {
    this.router.navigate(['/holder-group-add']);
  }

  handleDelete(row: HolderGroupDto) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Delete Info!',
      nzContent: 'Do you Want to delete this items?',
      nzOnOk: () => {
        this.holderGroupApiService.deleteHolderGroupUsingDELETE(row.id).subscribe(() => {
          this.reload();
        }, (error) => {
          this.message.create('error', error);
        });
      }
    });
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

  handleActionClick(val: TblAction) {
    switch (val.action) {
      case 'edit':
        this.router.navigate(['/holder-group-add/' + val.row['id']]);
        break;
      case 'delete':
        this.handleDelete(val.row);
        break;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
