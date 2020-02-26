import {Component, OnInit} from '@angular/core';
import {TblColumn} from '@profyu/core-ng-zorro';
import {formatDate} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-holder-scan-result',
  templateUrl: './holder-scan-result.component.html',
  styleUrls: ['./holder-scan-result.component.scss']
})
export class HolderScanResultComponent implements OnInit {


  public listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public pageSize = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public tblColumns: Array<TblColumn> = [
    {
      property: 'namespace',
      title: 'Namespace'
    },
    {
      property: 'caseId',
      title: 'Case Id',
      detail: true
    },
    {
      property: 'name',
      title: 'Name'
    },
    {
      property: 'riskLevel',
      title: 'Risk Level',
      type: 'level',
      width: 120,
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
    }
  ];
  public scanId: string;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.scanId = this.route.snapshot.paramMap.get('id');

    this.listOfData = [
      {
        'namespace': 'Standard',
        'caseId': 'CS001',
        'name': 'Spencer Lin',
        'riskLevel': 1,
        'critical': 10,
        'major': 2,
        'minor': 7
      },
      {
        'namespace': 'Standard',
        'caseId': 'CS003',
        'name': 'Ernie Ho',
        'riskLevel': 2,
        'critical': 10,
        'major': 20,
        'minor': 19
      }, {
        'namespace': 'Standard',
        'caseId': 'CS002',
        'name': 'Spencer Lin',
        'riskLevel': 1,
        'critical': 10,
        'major': 22,
        'minor': 13
      }, {
        'namespace': 'Standard',
        'caseId': 'CS0013',
        'name': 'Spencer Lin',
        'riskLevel': 3,
        'critical': 12,
        'major': 23,
        'minor': 81
      }, {
        'namespace': 'Standard',
        'caseId': 'CS005',
        'name': 'Spencer Lin',
        'riskLevel': 2,
        'critical': 9,
        'major': 20,
        'minor': 14
      }
    ];
  }

  export() {
  }

  handleDetailClick(row) {
    this.router.navigate(['/???' + row.caseId]);
  }

  handlePageSizeChange(pageSize) {
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
