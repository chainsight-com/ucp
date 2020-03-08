import { Component, OnInit } from '@angular/core';
import {TblColumn} from '@profyu/core-ng-zorro';
import {Router} from '@angular/router';

@Component({
  selector: 'app-holder-group',
  templateUrl: './holder-group.component.html',
  styleUrls: ['./holder-group.component.scss']
})
export class HolderGroupComponent implements OnInit {

  public listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public pageSize = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public tblColumns: Array<TblColumn<any>> = [
    {
      property: 'namespace',
      title: 'Namespace'
    },
    {
      property: 'status',
      title: 'Status'
    },
    {
      title: 'Action',
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

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.listOfData = [{
      'namespace': 'VIP',
      'status': 'Enabled'
    }];
  }

  addNamespace() {
    this.router.navigate(['/namespace-add']);
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
  }

}
