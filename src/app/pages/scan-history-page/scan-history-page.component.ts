import {Component, OnInit} from '@angular/core';
import {
  Account,
  BtcAddressScanPipelineApiService,
  EthAddressScanPipelineApiService,
  PageOfBtcAddressScanPipeline,
  PageOfEthAddressScanPipeline,
  XrpAddressScanPipelineApiService,
  ZilAddressScanPipelineApiService
} from '@profyu/unblock-ng-sdk';
import {filter, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {JwtService} from '@profyu/core-ng-zorro';

@Component({
  selector: 'app-scan-history-page',
  templateUrl: './scan-history-page.component.html',
  styleUrls: ['./scan-history-page.component.scss']
})
export class ScanHistoryPageComponent implements OnInit {

  public selectedTabIndex = 0;

  private EMPTY_PAGE = {
    content: [],
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0
  };

  public me: Account;

  public btcPipelinePage: PageOfBtcAddressScanPipeline = this.EMPTY_PAGE;
  public btcPageSize = 30;
  public btcPage = 1;
  public isBtcLoading = false;

  public ethPipelinePage: PageOfEthAddressScanPipeline = this.EMPTY_PAGE;
  public ethPageSize = 30;
  public ethPage = 1;
  public isEthLoading = false;

  public xrpPipelinePage: PageOfEthAddressScanPipeline = this.EMPTY_PAGE;
  public xrpPageSize = 30;
  public xrpPage = 1;
  public isXrpLoading = false;

  public zilPipelinePage: PageOfBtcAddressScanPipeline = this.EMPTY_PAGE;
  public zilPageSize = 30;
  public zilPage = 1;
  public isZilLoading = false;

  constructor(
    private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService,
    private ethAddressScanPipelineApiService: EthAddressScanPipelineApiService,
    private xrpAddressScanPipelineApiService: XrpAddressScanPipelineApiService,
    private zilAddressScanPipelineApiService: ZilAddressScanPipelineApiService,
    private jwtService: JwtService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.me = this.jwtService.getMe();
    this.reloadBtcPipelines(true);
    this.reloadEthPipelines(true);
    this.reloadXrpPipelines(true);
    this.reloadZilPipelines(true);
    this.activatedRoute.queryParams
      .pipe(
        filter(params => params.type)
      )
      .subscribe(params => {
        if (params.type === 'BTC') {
          this.selectedTabIndex = 0;
        } else if (params.type === 'ETH') {
          this.selectedTabIndex = 1;
        } else if (params.type === 'XRP') {
          this.selectedTabIndex = 2;
        } else if (params.type === 'ZIL') {
          this.selectedTabIndex = 3;
        }
      });
  }


  reloadBtcPipelines(reset: boolean) {

    if (reset) {
      this.btcPage = 1;
    }
    this.isBtcLoading = true;
    this.btcAddressScanPipelineApiService.paginateBtcAddressScanPipelinesUsingGETDefault(this.btcPage - 1, this.btcPageSize, this.me.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.btcPipelinePage = page;
    }, console.error, () => {
      this.isBtcLoading = false;
    });
  }

  reloadEthPipelines(reset: boolean) {

    if (reset) {
      this.btcPage = 1;
    }
    this.isEthLoading = true;
    this.ethAddressScanPipelineApiService.paginateEthAddressScanPipelinesUsingGETDefault(this.ethPage - 1, this.ethPageSize, this.me.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.ethPipelinePage = page;
    }, console.error, () => {
      this.isEthLoading = false;
    });
  }

  reloadXrpPipelines(reset: boolean) {

    if (reset) {
      this.btcPage = 1;
    }
    this.isXrpLoading = true;
    this.xrpAddressScanPipelineApiService.paginateXrpAddressScanPipelinesUsingGETDefault(this.xrpPage - 1, this.xrpPageSize, this.me.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.xrpPipelinePage = page;
    }, console.error, () => {
      this.isXrpLoading = false;
    });
  }

  reloadZilPipelines(reset: boolean) {

    if (reset) {
      this.zilPage = 1;
    }
    this.isZilLoading = true;
    this.zilAddressScanPipelineApiService.paginateZilAddressScanPipelinesUsingGETDefault(this.btcPage - 1, this.btcPageSize, this.me.id)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.zilPipelinePage = page;
    }, console.error, () => {
      this.isZilLoading = false;
    });
  }

}
