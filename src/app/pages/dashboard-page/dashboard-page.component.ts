import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { filter, map, mergeMap, take, takeUntil, tap } from "rxjs/operators";
import { from, Subject } from "rxjs";
import { TblColumn } from "../../shared/table/tbl-column";
import { formatDate } from "@angular/common";
import { EMPTY_PAGE, Page } from "../../models/type/page";
import { ActivatedRoute, Router } from "@angular/router";
import { CurrencyDto, ProjectDto, TxDto } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  public project: ProjectDto;
  public columns: Array<TblColumn<TxDto>> = [
    {
      title: 'Time',
      formatter: row => {
        return formatDate(row.createdTime, 'short', 'en-US', '');
      }
    },
    {
      title: 'Type',
      detail: false,
      formatter: row => {
        return this.formatTxType(row.type);
      }
    },
    {
      property: 'amount',
      title: 'Amount',
      detail: false
    }
  ];


  public page: Page<TxDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public isLoading = false;

  public currencies: Array<CurrencyDto | ({ isAvailable: boolean })>


  constructor(
    private userService: UserService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(project => !!project),
        mergeMap(project => from(this.api.projectApi.getProjectUsingGET(project.id))),
        map(resp => resp.data)

      )
      .subscribe((project) => {
        this.project = project;
        this.reload(true);
        this.loadCurrencies(project.currencies);
      });
  }

  reload(reset: boolean) {

    if (reset) {
      this.pageIdx = 0;
    }
    this.isLoading = true;
    from(this.api.txApi.paginateTxUsingGET(this.pageIdx, this.pageSize, this.userService.project.id))
      .pipe(
        take(1),
        map(resp => resp.data)
      ).subscribe(page => {
        this.page = page;
      }, console.error, () => {
        this.isLoading = false;
      });
  }

  loadCurrencies(projectCurrencies: CurrencyDto[]) {
    from(this.api.currencyApi.listCurrenciesUsingGET())
      .pipe(
        take(1),
        map(resp => resp.data)
      )
      .subscribe(allCurrencies => {
        this.currencies = allCurrencies.map(c => {
          return {
            id: c.id,
            name: c.name,
            unitRate: c.unitRate,
            isAvailable: false,
          };
        });
        projectCurrencies.forEach(pc => {
          const c = this.currencies.find(c => (c as CurrencyDto).id === pc.id);
          if (c) {
            (c as { isAvailable: boolean }).isAvailable = true;
          }
        });
      });
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false);
  }

  handleDetailClick(row) {

  }

  handleActionClick(val) {

  }


  formatTxType(type: string) {
    let res = null;
    switch (type) {
      case 'TOP_UP':
        return 'Top Up'
      case 'CHARGE_ADDRESS_SCAN':
        return 'Address Scan';
      case 'CHARGE_FLOW_LABELING':
        return 'Flow Labeling';
      default:
        return ''
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
