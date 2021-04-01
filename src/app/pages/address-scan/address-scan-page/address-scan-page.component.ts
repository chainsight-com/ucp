import {Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {AddressScanTableComponent} from "../../../component/address-scan/address-scan-table/address-scan-table.component";

@Component({
  selector: 'app-address-scan-page',
  templateUrl: './address-scan-page.component.html',
  styleUrls: ['./address-scan-page.component.scss']
})
export class AddressScanPageComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  public me: AccountDto;
  public project: ProjectDto;
  public batchId: string;

  @ViewChild("addressScanTable", {static: false})
  public addressScanTable: AddressScanTableComponent;

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
      });
  }

  addScan() {
    this.router.navigate(['/address-scan/create']);
  }

  ngOnChanges(changes) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleDetailClick(row: AddressScanDto) {
    this.router.navigate(['address-scan', row.id]);
  }


}
