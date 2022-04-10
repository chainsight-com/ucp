import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {RISK_LEVEL_LIST, RISK_LEVEL_MAP} from "../../../models/address-case-risk-level-option";
import {ADDRESS_CASE_STATUS_LIST, ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {from, Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, map, take, takeUntil} from "rxjs/operators";
import * as dateFns from 'date-fns';
import {INCIDENT_STATUS_LIST} from "../../../models/incident-status-option";
import {EMPTY_PAGE, Page} from "../../../models/type/page";
import {NzDrawerRef, NzMessageService} from "ng-zorro-antd";
import {IncidentClusterGraphComponent} from "../../../component/incident-cluster-graph/incident-cluster-graph.component";
import {AddressScanTableComponent} from "../../../component/address-scan/address-scan-table/address-scan-table.component";
import {AddressScanFormComponent} from "../../../component/address-scan/address-scan-form/address-scan-form.component";
import {SummedClusterGraphComponent} from "../../../component/summed-cluster-graph/summed-cluster-graph.component";
import { Address, AddressCaseCommentDto, AddressCaseDtoLevelEnum, AddressCaseDtoStatusEnum, AddressScanDto, ClusterNodeDto, IncidentClusterBulkCreation, IncidentClusterNodeDto, IncidentClusterUpdates, IncidentDto, IncidentDtoStatusEnum } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';


export const COLORS = [
  ['#AC193D', '#BF1E4B'],
  ['#2672EC', '#2E8DEF'],
  ['#8C0095', '#A700AE'],
  ['#5133AB', '#643EBF'],
  ['#008299', '#00A0B1'],
  ['#D24726', '#DC572E'],
  ['#008A00', '#00A600'],
  ['#094AB2', '#0a5bc4'],
  ['#575757', '#6c6c6c']
];


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

  @ViewChild("incidentClusterGraph", {static: false})
  private incidentClusterGraph: IncidentClusterGraphComponent;

  @ViewChild("addressScanTable", {static: false})
  private addressScanTable: AddressScanTableComponent;

  @ViewChild("addressScanForm", {static: false})
  private addressScanForm: AddressScanFormComponent;

  @ViewChild("summedClusterGraph", {static: false})
  private summedClusterGraph: SummedClusterGraphComponent;

  public fillColorOptions: string[] = COLORS.map(c => c[0]);
  public strokeColorOptions: string[] = COLORS.map(c => c[1]);

  public isLoadingIncident = false;
  public incident: IncidentDto = {};

  public incidentStatusList = INCIDENT_STATUS_LIST;
  public isSubmittingStatus: boolean;
  public _status: IncidentDtoStatusEnum;

  get status(): IncidentDtoStatusEnum {
    return this._status;
  }

  set status(value: IncidentDtoStatusEnum) {
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
  public selectedClusterAddresses: Address[] = [];


  public showAddScanDrawer: boolean = false;
  public selectedIncidentClusterNode: IncidentClusterNodeDto;
  public selectedIncidentClusterAddresses: Address[] = [];
  public incidentGraphActions = [
    {
      name: 'scan',
      title: 'Scan'
    },
    {
      name: 'attribute',
      title: 'Attribute'
    },
    {
      name: 'detail',
      title: 'Detail'
    }
  ]


  public showIncidentClusterDrawer: boolean = false;


  public editIncidentClusterForm: FormGroup;
  public showEditIncidentClusterDrawer: boolean = false;
  public isSubmittingEditIncidentCluster: boolean = false;


  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private api: ApiService,
              private messageService: NzMessageService) {
    this.editIncidentClusterForm = this.fb.group({
      title: [null, []],
      subtitle: [null, []],
      fillColor: [null, []],
      strokeColor: [null, []],
    });
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
    from(this.api.incidentApi.getIncident(id))
      .pipe(
        take(1),
        map(resp => resp.data)
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

  statusFormatter(status: AddressCaseDtoStatusEnum) {

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

  levelFormatter(level: AddressCaseDtoLevelEnum) {
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

  private submitStatus(value: IncidentDtoStatusEnum) {
    this.isSubmittingStatus = true;
    from(this.api.incidentApi.patchIncidentStatus(this.incident.id, value))
      .pipe(
        take(1),
        map(resp => resp.data),
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

  public onAddressScanGraphAction(e: { action: string, nodes: ClusterNodeDto[] }) {
    if (e.action === 'detail') {
      if (e.nodes.length > 0) {
        this.showClusterDrawer = true;
        this.selectedClusterNode = e.nodes[0];
        this.selectedClusterAddresses = e.nodes[0].addresses.map(a => {
          return {
            currencyId: this.selectedClusterNode.currencyId,
            address: a,
          };
        });
      }
    } else if (e.action === 'add') {
      const payload: IncidentClusterBulkCreation = {
        incidentId: this.incidentId,
        addressScanId: this.currentAddressScan.id,
        data: e.nodes.map(n => {
          return {
            clusterId: n.clusterId,
            isAddress: n.addresses.length === 1,
            title: this.currentAddressScan.currency.name.toUpperCase(),
            subtitle: n.clusterId,
            fillColor: COLORS[8][0],
            strokeColor: COLORS[8][1],
          };
        })
      };
      this.isLoadingAddressScanGraph = true;
      from(this.api.incidentClusterApi.createIncidentCluster(payload))
        .pipe(
          take(1),
          map(resp => resp.data)
        )
        .subscribe(() => {
          this.incidentClusterGraph.reload();
          this.messageService.success("Added");
        }, console.error, () => {
          this.isLoadingAddressScanGraph = false;
        });
    }
  }

  closeClusterDrawer() {
    this.showClusterDrawer = false;
  }

  addScan() {
    this.selectedIncidentClusterNode = null;
    this.showAddScanDrawer = true;
  }

  onIncidentGraphAction(e: { action: string; nodes: IncidentClusterNodeDto[] }) {
    if (e.action === 'scan') {
      if (e.nodes.length > 0) {
        this.selectedIncidentClusterNode = e.nodes[0];
        this.showAddScanDrawer = true;
      }

    } else if (e.action === 'detail') {
      if (e.nodes.length > 0) {
        this.selectedIncidentClusterNode = e.nodes[0];
        this.showIncidentClusterDrawer = true;
        this.selectedIncidentClusterAddresses = e.nodes[0].addresses.map(a => {
          return {
            currencyId: e.nodes[0].currency.id,
            address: a,
          };
        });
      }
    } else if (e.action === 'attribute') {
      if (e.nodes.length > 0) {
        this.selectedIncidentClusterNode = e.nodes[0];
        this.editIncidentClusterForm.reset({
          title: this.selectedIncidentClusterNode.incidentCluster.title,
          subtitle: this.selectedIncidentClusterNode.incidentCluster.subtitle,
          fillColor: this.selectedIncidentClusterNode.incidentCluster.fillColor,
          strokeColor: this.selectedIncidentClusterNode.incidentCluster.strokeColor,
        });
        this.showEditIncidentClusterDrawer = true;
      }
    }

  }

  closeAddScanDrawer() {
    this.showAddScanDrawer = false;
  }

  onScanSubmitted(created: AddressScanDto) {
    this.showAddScanDrawer = false;

    from(this.api.incidentAddressScanApi.createIncidentAddressScan({
      incidentId: this.incidentId,
      addressScanId: created.id,
    }))
      .pipe(
        take(1),
        map(resp => resp.data)
      ).subscribe(resp => {
      this.addressScanTable.reload(true, false);
    }, console.error);

  }

  submitEditIncidentDrawer() {
    for (const i in this.editIncidentClusterForm.controls) {
      this.editIncidentClusterForm.controls[i].markAsDirty();
      this.editIncidentClusterForm.controls[i].updateValueAndValidity();
    }

    if (this.editIncidentClusterForm.invalid) {
      return;
    }

    const formValue = this.editIncidentClusterForm.value;

    const body: IncidentClusterUpdates = {
      title: formValue.title,
      subtitle: formValue.subtitle,
      fillColor: formValue.fillColor,
      strokeColor: formValue.strokeColor
    };


    this.isSubmittingEditIncidentCluster = true;
    from(this.api.incidentClusterApi.updateIncidentCluster(this.selectedIncidentClusterNode.incidentCluster.id, body))
      .pipe(
        take(1),
        map(resp => resp.data),
        finalize(() => {
          this.isSubmittingEditIncidentCluster = false;
        })
      ).subscribe(updated => {
      this.showEditIncidentClusterDrawer = false;
      this.incidentClusterGraph.updateCluster(updated.clusterId, updated);
    }, console.error);
  }

  closeIncidentClusterDrawer() {
    this.showIncidentClusterDrawer = false;

  }

  closeEditIncidentClusterDrawer() {
    this.showEditIncidentClusterDrawer = false;

  }


}
