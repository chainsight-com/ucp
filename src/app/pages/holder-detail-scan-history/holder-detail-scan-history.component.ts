import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../services/utils.service';
import {TblColumn} from "../../shared/table/tbl-column";

@Component({
  selector: 'app-holder-detail-scan-history',
  templateUrl: './holder-detail-scan-history.component.html',
  styleUrls: ['./holder-detail-scan-history.component.scss']
})
export class HolderDetailScanHistoryComponent implements OnInit {

  holderId: string;
  public listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public pageSize = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public tblColumns: Array<TblColumn<any>> = [
    {
      property: 'scanId',
      title: 'Scan Id',
      detail: true
    },
    {
      property: 'schedule',
      title: 'Schedule'
    },
    {
      property: 'riskLevel',
      title: 'Risk Level',
      type: 'level',
      width: 180,
      formatter: (data) => {
        return this.riskFormatter(data);
      }
    },
    {
      property: 'critical',
      title: 'Critical Issue'
    },
    {
      property: 'major',
      title: 'Major Issue'
    },
    {
      property: 'minor',
      title: 'Minor Issue'
    },
    {
      property: '',
      title: 'Last Scan At',
      formatter: data => {
        return this.utilService.transformDateShort(data.lastScanAt);
      }
    }
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private utilService: UtilsService) {
    this.holderId = this.route.snapshot.paramMap.get('id');
  }


  ngOnInit() {
    this.listOfData = [
      {
        'scanId': 'CS001',
        'schedule': 'Standard Monthly',
        'riskLevel': 2,
        'critical': 10,
        'major': 20,
        'minor': 19,
        'lastScanAt': '2011-10-12T00:01:10.000+0000'
      },
      {
        'scanId': 'CS002',
        'schedule': 'Standard Monthly',
        'riskLevel': 2,
        'critical': 10,
        'major': 20,
        'minor': 19,
        'lastScanAt': '2011-10-18T00:01:10.000+0000'
      },
      {
        'scanId': 'CS003',
        'schedule': 'Standard Monthly',
        'riskLevel': 1,
        'critical': 121,
        'major': 24,
        'minor': 10,
        'lastScanAt': '2019-08-12T00:00:10.000+0000'
      },
      {
        'scanId': 'CS004',
        'schedule': 'Standard Monthly',
        'riskLevel': 3,
        'critical': 10,
        'major': 20,
        'minor': 19,
        'lastScanAt': '2009-10-12T00:11:11.000+0000'
      },
      {
        'scanId': 'CS005',
        'schedule': 'VIP Scan',
        'riskLevel': 2,
        'critical': 9,
        'major': 10,
        'minor': 15,
        'lastScanAt': '2011-10-12T00:01:18.000+0000'
      },
      {
        'scanId': 'CS006',
        'schedule': 'VIP Scan',
        'riskLevel': 1,
        'critical': 12,
        'major': 26,
        'minor': 1,
        'lastScanAt': '2001-01-10T00:11:19.000+0000'
      }
    ];
  }


  handleDetailClick(row: any) {
    this.router.navigate(['/???' + row.scanId]);
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
  }

  riskFormatter(data) {
    let res = null;
    switch (data) {
      case 1:
        res = {
          color: 'green',
          title: 'Low'
        };
        break;
      case 2:
        res = {
          color: 'yellow',
          title: 'Medium'
        };
        break;
      case 3:
        res = {
          color: 'red',
          title: 'High'
        };
        break;
      default:
        res = {
          color: 'blue',
          title: 'N/A'
        };
    }
    return res;
  }

}
