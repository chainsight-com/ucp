import {Component, OnInit} from '@angular/core';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';
import {TblColumn} from "../../shared/table/tbl-column";

@Component({
  selector: 'app-holder-scan',
  templateUrl: './holder-scan.component.html',
  styleUrls: ['./holder-scan.component.scss']
})
export class HolderScanComponent implements OnInit {

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
      property: 'status',
      title: 'Status',
      type: 'level',
      width: 120,
      formatter: (data) => {
        return this.statusFormatter(data);
      }
    },
    {
      property: '',
      title: 'Started At',
      formatter: data => {
        return formatDate(data.createdTime, 'short', 'en-US', '');
      }
    },
    {
      property: '',
      title: 'Ended At',
      formatter: data => {
        return formatDate(data.endTime, 'short', 'en-US', '');
      }
    },
    {
      property: 'scheduledBy',
      title: 'ScheduledBy'
    },
    {
      property: 'cases',
      title: 'Cases'
    },
    {
      title: 'Actions',
      actions: [
        // {
        //   name: 'edit',
        //   title: 'Edit'
        // },
        // {
        //   name: 'delete',
        //   title: 'Delete'
        // },
        {
          name: 'suspend',
          title: 'Suspend'
        },
        {
          name: 'export',
          title: 'Export'
        }
      ]
    }
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.listOfData = [
      {
        'scanId': '#00001',
        'status': 'PENDING',
        'endTime': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000',
        'scheduledBy': 'Standard Monthly Scan',
        'cases': 10
      },
      {
        'scanId': '#00002',
        'status': 'COMPLETED',
        'endTime': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000',
        'scheduledBy': 'Standard Monthly Scan',
        'cases': 11
      },
      {
        'scanId': '#00003',
        'status': 'RUNNING',
        'endTime': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000',
        'scheduledBy': 'Standard Monthly Scan',
        'cases': 5
      },
      {
        'scanId': '#00004',
        'status': 'FAILED',
        'endTime': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000',
        'scheduledBy': 'Standard Monthly Scan',
        'cases': 5
      },
      {
        'scanId': '#00005',
        'status': 'PENDING',
        'endTime': '2011-10-12T00:01:10.000+0000',
        'createdTime': '2019-12-01T07:57:28.000+0000',
        'scheduledBy': 'N/A',
        'cases': 10
      }
    ];
  }

  addScan() {
    this.router.navigate(['/holder-scan-add']);
  }

  export() {
  }

  handleDetailClick(row) {
    this.router.navigate(['/holder-scan-result/' + row.scanId]);
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
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
          color: 'yellow',
          title: 'Pending'
        };
        break;
      case 'RUNNING':
        res = {
          color: 'blue',
          title: 'Running'
        };
        break;
      case 'FAILED':
        res = {
          color: 'red',
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
