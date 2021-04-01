import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {TblColumn} from "./tbl-column";
import {TblAction} from "./tbl-action";

@Component({
  selector: 'pfy-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input()
  tblBordered: boolean = false;
  @Input()
  tblSize: string;
  @Input()
  tblColumns: Array<TblColumn<any>>;
  @Input()
  tblData: Array<any>;
  @Input()
  pageIndex: number;
  pageSize: number;
  _pageSizeOptions: Array<number>;

  @Input()
  set pageSizeOptions(value: Array<number>) {
    // console.log(value);
    this._pageSizeOptions = value;
    this.pageSize = this._pageSizeOptions[0];
  }

  get pageSizeOptions() {
    return this._pageSizeOptions;
  }

  @Input()
  pageable: boolean;
  @Input()
  loading: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('slotTemplate')
  slotContent: TemplateRef<any>;

  @Input()
  total: number;

  frontPagination: boolean;

  @Output()
  actionClick = new EventEmitter();
  @Output()
  detailClick = new EventEmitter();
  @Output()
  rowClick = new EventEmitter();
  @Output()
  pageSizeChange = new EventEmitter();
  @Output()
  pageIndexChange = new EventEmitter();


  defaultPageSizeOpts = [10, 20, 50, 100];

  constructor() {
  }

  getSlot(data: TblColumn<any>): string | TemplateRef<void> | null {
    return this.slotContent[data.slot];
  }

  get getColumns() {
    return this.tblColumns.filter(col => !col.hidden);
  }

  ngOnInit() {
    if (!!this.total) {
      this.frontPagination = false;
    } else {
      this.frontPagination = true;
    }
    // console.log(this.total);
    // console.log(this.frontPagination);
  }

  handleActionClick(row: any, action: any) {
    this.actionClick.emit({
      row,
      action: action.name
    } as TblAction<any>);
  }

  handleDetailClick(row: any) {
    this.detailClick.emit(row);
  }

  handlePageSizeChange(size: number) {
    // console.log('page size change', size, this.pageIndex, this.pageSize);
    this.pageSize = size;
    this.pageSizeChange.emit(size);
  }

  handlePageIndexChange(index: number) {
    // console.log('page index change', index, this.pageIndex, this.pageSize);
    this.pageIndex = index;
    this.pageIndexChange.emit(this.pageIndex);
  }

  handleRowClick(row: any) {
    this.rowClick.emit(row);
  }

  getActions(row: any, actions: Array<{ name: string, title: string, more?: boolean }> | ((any) => Array<{ name: string, title: string, more?: boolean }>)) {
    if (typeof actions === "function") {
      return (actions as (any) => Array<{ name: string, title: string, more?: boolean }>)(row).filter(act => !act.more);
    }
    console.log(typeof actions);
    return actions.filter(act => !act.more);
  }

  getMoreActions(row: any, actions: Array<{ name: string, title: string, more?: boolean }> | ((any) => Array<{ name: string, title: string, more?: boolean }>)) {
    if (typeof actions === "function") {
      return (actions as (any) => Array<{ name: string, title: string, more?: boolean }>)(row).filter(act => act.more);
    }
    return actions.filter(act => act.more);

  }

  getThWidth(col: TblColumn<any>) {
    if (!!col.width) {
      return col.width + 'px';
    }
    return null;
  }
}
