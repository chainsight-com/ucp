import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {UtilsService} from '../../services/utils.service';
import {TblColumn} from "../../shared/table/tbl-column";

@Component({
  selector: 'app-holder-scan-schedule',
  templateUrl: './holder-scan-schedule.component.html',
  styleUrls: ['./holder-scan-schedule.component.scss']
})
export class HolderScanScheduleComponent implements OnInit {

  public listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public pageSize = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public tblColumns: Array<TblColumn<any>> = [
    {
      property: 'name',
      title: 'Name',
      detail: true
    },
    {
      property: '',
      title: 'Status',
      formatter: data => {
        if (data.status === 1) {
          return 'Enabled';
        } else if (data.status === 0) {
          return 'Disabled';
        } else {
          return 'N/A';
        }
      }
    },
    {
      property: '',
      title: 'Next Scan At',
      formatter: data => {
        return this.utilService.transformDateShort(data.nextScanAt);
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
        }
      ]
    }
  ];
  public scanId: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private utilService: UtilsService) {
    this.scanId = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit() {

    this.listOfData = [
      {
        'name': 'Standard Monthly Scan',
        'status': 0,
        'nextScanAt': '2019-12-01T12:57:28.000+0000'

      },
      {
        'name': 'Standard Monthly Scan',
        'status': 1,
        'nextScanAt': ''

      },
      {
        'name': 'VIP Monthly Scan',
        'status': 1,
        'nextScanAt': '2019-11-01T09:57:28.000+0000'

      }
    ];
  }

  transformDate(data) {
    let res = null;
    try {
      res = formatDate(data.nextScanAt, 'short', 'en-US', '');
    } catch (e) {
      res = 'N/A';
    }
    return res;
  }

  addSchedule() {
    this.router.navigate(['/holder-scan-schedule-add']);
  }

  handleDetailClick(row) {
    this.router.navigate(['/???' + row.caseId]);
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

  handleActionClick(val) {
  }
}
