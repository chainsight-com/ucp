import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  AddressCaseApiService,
  AddressCaseCommentApiService,
  AddressCaseCommentCreation,
  AddressCaseCommentDto,
  AddressCaseDto,
  AddressScanDto,
  ClusterNodeDto,
  IncidentAddressScanApiService,
  IncidentApiService,
  IncidentClusterApiService, IncidentClusterBulkCreation,
  IncidentDto
} from "@profyu/unblock-ng-sdk";
import {RISK_LEVEL_LIST, RISK_LEVEL_MAP} from "../../../models/address-case-risk-level-option";
import {ADDRESS_CASE_STATUS_LIST, ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, take, takeUntil} from "rxjs/operators";
import * as dateFns from 'date-fns';
import {INCIDENT_STATUS_LIST} from "../../../models/incident-status-option";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-incident-detail-page',
  templateUrl: './incident-detail-page.component.html',
  styleUrls: ['./incident-detail-page.component.scss']
})
export class IncidentDetailPageComponent implements OnInit, OnChanges {

  @Input()
  public incidentId: string;
  @Input()
  public showComments: boolean = true
  @Input()
  public showScans: boolean = true


  public isLoadingIncident = false;
  public incident: IncidentDto = {};

  public incidentStatusList = INCIDENT_STATUS_LIST;
  public isSubmittingStatus: boolean;
  public _status: IncidentDto.StatusEnum;

  get status(): IncidentDto.StatusEnum {
    return this._status;
  }

  set status(value: IncidentDto.StatusEnum) {
    this._status = value;
    if (this.incident && value && this.incident.status !== value) {
      this.submitStatus(value);
    }
  }


  private unsubscribe$ = new Subject<void>();

  public isLoadingAddressScanGraph: boolean = false;
  public showAddressScanDrawer = false;
  public currentAddressScan: AddressScanDto;
  public addressScanGraphActions = [
    {
      name: 'add',
      title: 'Add To Incident'
    },
    {
      name: 'detail',
      title: 'Detail'
    }
  ];

  public showClusterDrawer: boolean = false;
  public selectedClusterNode: ClusterNodeDto;


  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private incidentApiService: IncidentApiService,
              private incidentClusterApiService: IncidentClusterApiService,
              private messageService: NzMessageService) {
  }


  ngOnInit() {

    this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(params => {
        if (params.id) {
          this.incidentId = params.id;
          this.reload(params.id);
        }
      });


  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  reload(id: string) {
    this.isLoadingIncident = true;
    this.incidentApiService.getIncidentUsingGET(id)
      .pipe(
        take(1)
      ).subscribe(resBody => {
      this.incident = resBody;
      this.status = this.incident.status;
    }, console.error, () => {
      this.isLoadingIncident = false;
    });
  }


  readableDuration(time: string | Date) {
    if (!time) {
      return '';
    }
    return dateFns.formatDistance(new Date(time), new Date());
  }


  formatAuthor(comment: AddressCaseCommentDto) {
    let retVal = '';

    if (comment && comment.creator) {
      if (comment.creator.firstName) {
        retVal += comment.creator.firstName;
      }
      if (comment.creator.lastName) {
        retVal += ' ' + comment.creator.lastName;
      }
    }
    return retVal;

  }

  statusFormatter(status: AddressCaseDto.StatusEnum) {

    const attr = ADDRESS_CASE_STATUS_MAP[status];
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

  levelFormatter(level: AddressCaseDto.LevelEnum) {
    const attr = RISK_LEVEL_MAP[level];
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

  private submitStatus(value: IncidentDto.StatusEnum) {
    this.isSubmittingStatus = true;
    this.incidentApiService.patchIncidentStatusUsingPATCH(this.incident.id, value)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmittingStatus = false;
        })
      ).subscribe(resBody => {
      this.reload(this.incident.id)
    }, console.error);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incidentId) {
      if (this.incidentId) {
        this.reload(this.incidentId);
      }
    }
  }

  closeAddressScanDrawer() {
    this.showAddressScanDrawer = false;
  }


  onAddressScanClick(row: AddressScanDto) {
    this.currentAddressScan = row;
    this.showAddressScanDrawer = true;
  }

  public onAddressScanGraphAction(e: { action: string, nodes: any[] }) {
    if (e.action === 'detail') {
      if (e.nodes.length > 0) {
        this.showClusterDrawer = true;
        this.selectedClusterNode = e.nodes[0].payload;
      }
    } else if (e.action === 'add') {
      const payload: IncidentClusterBulkCreation = {
        incidentId: this.incidentId,
        addressScanId: this.currentAddressScan.id,
        data: e.nodes.map(n => {
          return {
            clusterId: n.payload.clusterId,
            isAddress: n.payload.addresses.length == 1,
            title: n.payload.clusterId,
            subtitle: this.currentAddressScan.currency.name.toUpperCase()
          };
        })
      };
      this.isLoadingAddressScanGraph = true;
      this.incidentClusterApiService.createIncidentClusterUsingPOST(payload)
        .pipe(
          take(1)
        )
        .subscribe(() => {
          this.messageService.success("Added");
        }, console.error, () => {
          this.isLoadingAddressScanGraph = false;
        });
    }
  }

  closeClusterDrawer() {
    this.showClusterDrawer = false;
  }

}
