import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {filter, finalize, take, takeUntil} from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';
import {QrScannerService} from 'src/app/services/qr-scanner.service';
import {Subject} from 'rxjs';
import {UserService} from "../../../services/user.service";
import { ApiService } from 'src/app/services/api.service';
import { AddressScanDto, ProjectDto } from '@chainsight/unblock-api-axios-sdk';


@Component({
  selector: 'app-new-scan-page',
  templateUrl: './address-scan-add-page.component.html',
  styleUrls: ['./address-scan-add-page.component.scss']
})
export class AddressScanAddPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public project: ProjectDto;
  public currencyId: string;
  public address: string;

  constructor(private router: Router,
              private qrScannerService: QrScannerService,
              private fb: FormBuilder,
              private httpClient: HttpClient,
              private api: ApiService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((project) => {
        this.project = project;
      });
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.currencyId)
      )
      .subscribe(params => {
        this.currencyId = params.currencyId;
      });
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.address)
      )
      .subscribe(params => {
        this.address = params.address;
      });
  }

  onSubmit(created: AddressScanDto) {
    this.router.navigate(['address-scan']);

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
