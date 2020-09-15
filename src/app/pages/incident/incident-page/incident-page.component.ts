import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountDto, IncidentApiService, IncidentDto, ProjectDto} from "@profyu/unblock-ng-sdk";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, take, takeUntil} from "rxjs/operators";
import {IncidentTableComponent} from "../../../component/incident/incident-table/incident-table.component";
import {Subject} from "rxjs";
import {IncidentAddressScanCreation} from "@profyu/unblock-ng-sdk/model/incident-address-scan-creation";

@Component({
  selector: 'app-incident-page',
  templateUrl: './incident-page.component.html',
  styleUrls: ['./incident-page.component.scss']
})
export class IncidentPageComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  public me: AccountDto;
  public project: ProjectDto;
  public batchId: string;

  @ViewChild("incidentTable", {static: false})
  public incidentTable: IncidentTableComponent;

  public showIncidentFormDrawer: boolean = false;

  constructor(
    private incidentApiService: IncidentApiService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.me = this.userService.getMe();
    this.activatedRoute.queryParams
      .pipe(
        filter(params => params.batchId)
      )
      .subscribe(params => {
        this.batchId = params.batchId;
      });
    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((project) => {
        this.project = project;
      });
  }

  ngOnChanges(changes) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleDetailClick(row: IncidentDto) {
    this.router.navigate(['incident', row.id]);
  }

  addIncident() {
    this.showIncidentFormDrawer = true;
  }

  closeIncidentFormDrawer() {
    this.showIncidentFormDrawer = false;
  }

  onIncidentFormSubmit(incident: IncidentDto) {
    this.closeIncidentFormDrawer();
    this.incidentTable.reload(true, false);

  }

}
