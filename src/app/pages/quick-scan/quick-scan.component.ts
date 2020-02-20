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
import {JwtService} from '../../services/jwt.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, take} from 'rxjs/operators';
import {NzTabComponent} from 'ng-zorro-antd';
import {TblColumn} from '@profyu/core-ng-zorro/lib/model/tblColumn';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-quick-scan',
  templateUrl: './quick-scan.component.html',
  styleUrls: ['./quick-scan.component.scss']
})
export class QuickScanComponent implements OnInit {
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
  public btcTblColumns: Array<TblColumn> = [
    {
      property: 'status',
      title: 'Status',
      type: 'level',
      formatter: (data) => {
        return this.statusFormatter(data);
      }
    },
    {
      property: 'address',
      title: 'Address',
      detail: true
    },
    {
      property: 'maxLevel',
      title: 'Max Level'
    },
    {
      property: '',
      title: 'Time Range',
      formatter: data => {
        return formatDate(data.startingTime, 'short', 'en-US', '') + '-' +
          formatDate(data.endingTime, 'short', 'en-US', '');
      }
    },
    {
      property: '',
      title: 'Created Time',
      formatter: data => {
        return formatDate(data.createdTime, 'short', 'en-US', '');
      }
    }
  ];



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
    private activatedRoute: ActivatedRoute,
    private router: Router) {
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

  addScan() {
    this.router.navigate(['/quick-scan-add']);
  }

  handleSelectChange(val: { index: number, tab: NzTabComponent }) {
    this.selectedTabIndex = val.index;
    console.log(this.selectedTabIndex);
  }

  reloadPipelines() {

    switch (this.selectedTabIndex) {
      case 0: {
        this.reloadBtcPipelines(false);
        break;
      }
      case 1: {
        this.reloadEthPipelines(false);
        break;
      }
      case 2: {
        this.reloadXrpPipelines(false);
        break;
      }
      case 3: {
        this.reloadZilPipelines(false);
        break;
      }
      default: {
        break;
      }
    }
  }

  handleBtcDetailClick(row) {
    this.router.navigate(['/btc-scan-result/' + row.id]);
  }

  statusFormatter(data) {

    let res = null;
    switch (data) {
      case 'COMPLETED':
        res = {
          color: '#52c41a',
          title: 'Success'
        };
        break;
      case 'PENDING':
        res = {
          color: 'processing',
          title: 'Running'
        };
        break;
      case 'RUNNING':
        res = {
          color: 'processing',
          title: 'Running'
        };
        break;
      case 'FAILED':
        res = {
          color: 'error',
          title: 'Error'
        };
        break;
      default:
        res = {
          color: '#108ee9',
          title: 'default'
        };
    }
    return res;
  }

}
