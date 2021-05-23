import {Component, OnInit} from '@angular/core';
import {
  CurrencyApiService,
  AddressScanDto, CurrencyDto,
  PageOfTxDto,
  ProjectApiService,
  ProjectDto, TxApiService, TxDto
} from "@profyu/unblock-ng-sdk";
import {UserService} from "../../services/user.service";
import {filter, mergeMap, take, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {TblColumn} from "../../shared/table/tbl-column";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../models/type/page";
import {ActivatedRoute, Router} from "@angular/router";


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
    private projectApiService: ProjectApiService,
    private txApiService: TxApiService,
    private currencyApiService: CurrencyApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(project => !!project),
        mergeMap(project => this.projectApiService.getProjectUsingGET(project.id))
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
    this.txApiService.paginateTxUsingGET(this.pageIdx, this.pageSize, this.userService.project.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  loadCurrencies(projectCurrencies: CurrencyDto[]) {
    this.currencyApiService.listCurrenciesUsingGET()
      .pipe(
        take(1)
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
