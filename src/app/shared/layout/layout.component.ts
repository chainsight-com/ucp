import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AccountCredentials, AccountDto, ProjectDto} from '@profyu/unblock-ng-sdk';
import {Menu} from "../side-menu/menu";
import {filter, map, mergeMap, take, takeUntil, tap} from "rxjs/operators";
import {AuthService} from "angularx-social-login";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from "@angular/router";
import {DashboardPageComponent} from "../../pages/dashboard-page/dashboard-page.component";


@Component({
  selector: 'pfy-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('account', {static: false}) private accountElement: ElementRef;
  isCollapsed: boolean = false;
  selectedMenu: Menu = new Menu();

  private unsubscribe$ = new Subject<void>();
  public account: AccountDto;
  public project: ProjectDto;
  public availableProjects: ProjectDto[] = [];
  public title: string = '';
  public subtitle: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit() {
    // title & subtitle
    this.updateForRoute();
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.updateForRoute();
        }
      });


    // account
    this.userService.loginState$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(loginState => {
      this.account = loginState.me;
    });
    // project
    this.userService.availableProjects$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(availableProjects => {
      this.availableProjects = availableProjects;
    });
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      this.project = project;
    });

  }

  updateForRoute() {
    let displays = {
      DashboardPageComponent: {
        title: 'Dashboard',
        subtitle: 'Project information overview',
      },
      AddressScanPageComponent: {
        title: 'Address Scan',
        subtitle: 'Address flow scanning',
      },
      AddressScanBatchPageComponent: {
        title: 'Address Scan Batch',
        subtitle: 'Large scale address flow scanning',
      },
      FlowLabelingPageComponent: {
        title: 'Flow Labeling',
        subtitle: 'Address automation labeling tool',
      },
      AddressCasePageComponent: {
        title: 'Case Management',
        subtitle: '',
      },
      IncidentPageComponent: {
        title: 'Incident Management',
        subtitle: 'Incident investigation tool',
      },

    };
    if (this.activatedRoute.firstChild) {
      const component = this.activatedRoute.firstChild.component;
      if (component) {
        const display = displays[(<any>component).name];
        if (display) {
          this.title = display.title;
          this.subtitle = display.subtitle;
          return;
        }

      }
      this.title = '';
      this.subtitle = null;

    }


  }

  ngAfterViewInit() {

  }

  valueChange(val) {
    this.isCollapsed = val;
  }

  routerChange(val: Menu) {
    this.selectedMenu = val;
  }

  async logout() {
    await this.userService.signOut();
    this.router.navigateByUrl('/login');
  }


  get selectedName() {
    if (!this.selectedMenu) {
      return '';
    } else {
      return this.selectedMenu.name;
    }
  }

  get selectedSubTitle() {
    if (!this.selectedMenu) {
      return '';
    } else {
      return this.selectedMenu.subtitle;
    }
  }

  get userName(): string {
    if (!this.account) {
      return '';
    } else {
      return this.account.firstName;
    }
  }

  switchProject(project: ProjectDto) {
    this.userService.switchProject(project);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
