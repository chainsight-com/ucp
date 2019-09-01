import { Component, OnInit } from '@angular/core';
import { BtcAddressScanPipeline, BtcAddressScanPipelineApiService, PageOfBtcAddressScanPipeline, Account } from 'src/sdk';
import { take } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-scan-history-page',
  templateUrl: './scan-history-page.component.html',
  styleUrls: ['./scan-history-page.component.scss']
})
export class ScanHistoryPageComponent implements OnInit {


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
  constructor(private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService, private jwtService: JwtService) { }

  ngOnInit() {
    this.me = this.jwtService.getMe();
    this.reloadBtcPipelines(true);
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

}
