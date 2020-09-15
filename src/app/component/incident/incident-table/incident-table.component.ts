import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {interval, Subject} from "rxjs";
import {IncidentApiService, IncidentDto} from "@profyu/unblock-ng-sdk";
import {TblColumn} from "../../../shared/table/tbl-column";
import {formatDate} from "@angular/common";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {Router} from "@angular/router";
import {filter, take, takeUntil} from "rxjs/operators";
import {ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {INCIDENT_STATUS_MAP} from "../../../models/incident-status-option";

@Component({
  selector: 'app-incident-table',
  templateUrl: './incident-table.component.html',
  styleUrls: ['./incident-table.component.scss']
})
export class IncidentTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public projectId: string;
  @Input()
  public holderId: string;
  @Input()
  public currencyId: string;
  @Input()
  public address: string;
  @Input()
  public title: string;

  @Output()
  public detailClick: EventEmitter<IncidentDto> = new EventEmitter<IncidentDto>();


  public columns: Array<TblColumn<IncidentDto>> = [
    {
      property: 'title',
      title: 'Title',
      detail: true
    },
    {
      title: 'Status',
      type: 'level',
      width: 150,
      formatter: (row) => {
        return this.statusFormatter(row.status);
      }
    },
    {
      title: 'Created Time',
      formatter: row => {
        return formatDate(row.createdTime, 'short', 'en-US', '');
      }
    },
  ];


  public page: Page<IncidentDto> = EMPTY_PAGE;
  public pageSize = 30;
  public pageSizeOptions = [30, 50, 100];
  public pageIdx = 1;
  public totalElements = 1;
  public isLoading = false;

  constructor(private router: Router,
              private incidentApiService: IncidentApiService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectId || changes.holderId|| changes.currencyId || changes.address || changes.title) {
      this.reload(true, false);
    }
  }

  ngOnInit() {

  }

  reload(reset: boolean, silent: boolean) {
    if (reset) {
      this.pageIdx = 1;
    }
    if (!silent) {
      this.isLoading = true;
    }
    this.incidentApiService.paginateIncidentUsingGET(this.pageIdx - 1, this.pageSize, this.projectId, this.holderId, this.currencyId, this.address, this.title)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.page = page;
      this.totalElements = Number(page.totalElements);
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  handlePageSizeChange(pageSize) {
    this.pageSize = pageSize;
    this.reload(false, false);
  }

  handleDetailClick(row: IncidentDto) {
    this.detailClick.emit(row);
  }


  statusFormatter(status: IncidentDto.StatusEnum) {

    const attr = INCIDENT_STATUS_MAP[status];
    if (!attr) {
      return {
        color: '#108ee9',
        title: 'default'
      };

    }
    return {
      color: attr.color,
      title: attr.label,
    };
  }

  ngOnDestroy(): void {
  }

}
