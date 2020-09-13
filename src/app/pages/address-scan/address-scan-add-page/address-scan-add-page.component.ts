import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {filter, finalize, take, takeUntil} from 'rxjs/operators';
import {
  AccountApiService, AccountDto, AddressScanApiService, AddressScanCreation, AddressScanDto, CurrencyDto, ProjectDto,
} from '@profyu/unblock-ng-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {QrScannerService} from 'src/app/services/qr-scanner.service';
import {Subject} from 'rxjs';
import {UserService} from "../../../services/user.service";


@Component({
  selector: 'app-new-scan-page',
  templateUrl: './address-scan-add-page.component.html',
  styleUrls: ['./address-scan-add-page.component.scss']
})
export class AddressScanAddPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private project: ProjectDto;
  private currencyId: string;
  private address: string;

  constructor(private router: Router,
              private qrScannerService: QrScannerService,
              private fb: FormBuilder,
              private httpClient: HttpClient,
              private addressScanApi: AddressScanApiService,
              private accountApiService: AccountApiService,
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
