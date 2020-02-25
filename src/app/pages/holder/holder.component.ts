import {Component, OnInit} from '@angular/core';
import {TblColumn} from '@profyu/core-ng-zorro/lib/model/tblColumn';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {TblAction} from '@profyu/core-ng-zorro';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss']
})
export class HolderComponent implements OnInit {

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
      property: 'holderId',
      title: 'Holder Id',
      detail: true
    },
    {
      property: 'name',
      title: 'Name'
    },
    {
      property: 'riskLevel',
      title: 'Risk Level'
    },
    {
      property: '',
      title: 'Last Scan At',
      formatter: data => {
        return formatDate(data.lastScanAt, 'short', 'en-US', '');
      }
    },
    {
      property: '',
      title: 'Create At',
      formatter: data => {
        return formatDate(data.createdTime, 'short', 'en-US', '');
      }
    },
    {
      title: 'Actions',
      actions: [
        {
          name: 'edit',
          title: 'Edit'
        },
        {
          name: 'delete',
          title: 'Delete'
        },
        {
          name: 'profile',
          title: 'Profile',
          more: true
        },
        {
          name: 'addresses',
          title: 'Addresses',
          more: true
        },
        {
          name: 'scanHistory',
          title: 'Scan History',
          more: true
        }

      ]
    }
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.listOfData = [
      {
        'namespace': 'Standard',
        'holderId': 'CS001',
        'name': 'Spencer Lin',
        'riskLevel': 3,
        'lastScanAt': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000'
      },
      {
        'namespace': 'Standard',
        'holderId': 'CS002',
        'name': 'Ernie Ho',
        'riskLevel': 1,
        'lastScanAt': '2014-10-12T00:10:00.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000'
      },
      {
        'namespace': 'Standard',
        'holderId': 'CS003',
        'name': 'Spencer Lin',
        'riskLevel': 4,
        'lastScanAt': '2017-11-12T00:00:00.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000'
      },
      {
        'namespace': 'Standard',
        'holderId': 'CS004',
        'name': 'Ernie Ho',
        'riskLevel': 3,
        'lastScanAt': '2017-10-12T00:00:00.000+0000',
        'createdTime': '2020-12-01T07:57:28.000+0000'
      },
      {
        'namespace': 'Standard',
        'holderId': 'CS005',
        'name': 'Spencer Lin',
        'riskLevel': 1,
        'lastScanAt': '2017-10-12T00:00:00.000+0000',
        'createdTime': '2019-10-01T07:57:28.000+0000'
      }
    ];
  }

  addHolder() {
    this.router.navigate(['/holder-add']);
  }

  export() {
  }

  handleDetailClick(row: any) {
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
  }

  handleDelete(row: any) {
  }

  handleActionClick(val: TblAction) {
    switch (val.action) {
      case 'edit':
        this.router.navigate(['/holder-add/' + val.row['holderId']]);
        break;
      case 'delete':
        this.handleDelete(val.row);
        break;
      case 'profile':
        this.router.navigate(['/holder-detail-profile/' + val.row['holderId']]);
        break;
      case 'addresses':
        this.router.navigate(['/holder-detail-address/' + val.row['holderId']]);
        break;
      case 'scanHistory':
        this.router.navigate(['/holder-detail-scan-history/' + val.row['holderId']]);
        break;
      default:
        break;
    }
  }
}
