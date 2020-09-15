import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {
  AddressCaseApiService,
  AddressCaseCommentApiService,
  AddressCaseCommentCreation,
  AddressCaseCommentDto,
  AddressCaseDto, AddressScanCreation,
  AddressScanDto,
  ClusterNodeDto,
  IncidentAddressScanApiService,
  IncidentApiService,
  IncidentClusterApiService, IncidentClusterBulkCreation, IncidentClusterDto, IncidentClusterNodeDto,
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
import {NzDrawerRef, NzMessageService} from "ng-zorro-antd";
import {IncidentClusterGraphComponent} from "../../../component/incident-cluster-graph/incident-cluster-graph.component";
import {AddressScanTableComponent} from "../../../component/address-scan/address-scan-table/address-scan-table.component";
import {IncidentClusterUpdates} from "@profyu/unblock-ng-sdk/model/incident-cluster-updates";


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

  private fillColorOptions: string[] = COLORS.map(c => c[0]);
  private strokeColorOptions: string[] = COLORS.map(c => c[1]);

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


  public showAddScanDrawer: boolean = false;
  public selectedIncidentClusterNode: IncidentClusterNodeDto;
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
              private incidentApiService: IncidentApiService,
              private incidentClusterApiService: IncidentClusterApiService,
              private messageService: NzMessageService,
              private incidentAddressScanApiService: IncidentAddressScanApiService) {
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

  public onAddressScanGraphAction(e: { action: string, nodes: ClusterNodeDto[] }) {
    if (e.action === 'detail') {
      if (e.nodes.length > 0) {
        this.showClusterDrawer = true;
        this.selectedClusterNode = e.nodes[0];
      }
    } else if (e.action === 'add') {
      const payload: IncidentClusterBulkCreation = {
        incidentId: this.incidentId,
        addressScanId: this.currentAddressScan.id,
        data: e.nodes.map(n => {
          return {
            clusterId: n.clusterId,
            isAddress: n.addresses.length == 1,
            title: this.currentAddressScan.currency.name.toUpperCase(),
            subtitle: n.clusterId,
            fillColor: COLORS[8][0],
            strokeColor: COLORS[8][1],
          };
        })
      };
      this.isLoadingAddressScanGraph = true;
      this.incidentClusterApiService.createIncidentClusterUsingPOST(payload)
        .pipe(
          take(1)
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

    this.incidentAddressScanApiService.createIncidentAddressScanUsingPOST({
      incidentId: this.incidentId,
      addressScanId: created.id,
    })
      .pipe(
        take(1)
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
    this.incidentClusterApiService.updateIncidentClusterUsingPUT(this.selectedIncidentClusterNode.incidentCluster.id ,body)
      .pipe(
        take(1),
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
