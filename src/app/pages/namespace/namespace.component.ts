import {Component, OnInit} from '@angular/core';
import {TblColumn} from '@profyu/core-ng-zorro/lib/model/tblColumn';

@Component({
  selector: 'app-namespace',
  templateUrl: './namespace.component.html',
  styleUrls: ['./namespace.component.scss']
})
export class NamespaceComponent implements OnInit {

  listOfData: Array<any>;
  public isLoading = false;
  public currentPage = 0;
  public total = 0;
  public pageSizeOptions = [30, 50, 100];
  public tblColumns: Array<TblColumn> = [
    {
      property: 'namespace',
      title: 'Namespace'
    },
    {
      property: 'status',
      title: 'Status',
      detail: true
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

  constructor() {
  }

  ngOnInit() {
    this.listOfData = [{
      'namespace': 'VIP',
      'status': 'Enabled'
    }];
  }

  addNamespace() {
  }

  handleDetailClick(row) {
  }

  handlePageSizeChange(index) {
  }

}
