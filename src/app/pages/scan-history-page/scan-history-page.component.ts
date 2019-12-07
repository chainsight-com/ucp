import { Component, OnInit } from '@angular/core';
import { BtcAddressScanPipeline, BtcAddressScanPipelineApiService, PageOfBtcAddressScanPipeline, Account, EthAddressScanPipelineApiService, PageOfEthAddressScanPipeline, XrpAddressScanPipelineApiService } from '@profyu/unblock-ng-sdk';
import { take, filter } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { Route, ActivatedRoute } from '@angular/router';

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

  constructor(private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService, private ethAddressScanPipelineApiService: EthAddressScanPipelineApiService, private xrpAddressScanPipelineApiService: XrpAddressScanPipelineApiService, private jwtService: JwtService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.me = this.jwtService.getMe();
    this.reloadBtcPipelines(true);
    this.reloadEthPipelines(true);
    this.reloadXrpPipelines(true);
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

}
