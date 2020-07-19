import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {catchError, filter, finalize, take, takeUntil} from 'rxjs/operators';
import {
  AccountApiService,
  AccountDto, AddressCaseApiService,
  AddressCaseCreation,
  AddressCaseDto,
  AddressScanApiService,
  AddressScanCreation,
  CurrencyDto,
  ProjectDto, RestApiException,
} from '@profyu/unblock-ng-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {QrScannerService} from 'src/app/services/qr-scanner.service';
import {Subject} from 'rxjs';
import {UserService} from "../../../services/user.service";
import ApiErrorCodeEnum = RestApiException.ApiErrorCodeEnum;
import {NzMessageService} from "ng-zorro-antd";
import {RISK_LEVEL_LIST, AddressCaseRiskLevelOption} from "../../../models/address-case-risk-level-option";


@Component({
  selector: 'app-address-case-add-page',
  templateUrl: './address-case-add-page.component.html',
  styleUrls: ['./address-case-add-page.component.scss']
})
export class AddressCaseAddPageComponent implements OnInit, OnChanges {

  @Input()
  private currencyId: string;
  @Input()
  private address: string;

  public form: FormGroup;
  public isSubmitting = false;
  private unsubscribe$ = new Subject<void>();
  currencies: CurrencyDto[];
  public riskLevels = RISK_LEVEL_LIST;


  constructor(private router: Router,
              private qrScannerService: QrScannerService,
              private fb: FormBuilder,
              private httpClient: HttpClient,
              private addressCaseApi: AddressCaseApiService,
              private accountApiService: AccountApiService,
              private userService: UserService,
              private message: NzMessageService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((project) => {
        if (project) {
          this.currencies = project.currencies;
        }

      });

    this.form = this.fb.group({
      title: [null, [Validators.required]],
      currencyId: [null, [Validators.required]],
      address: ['', [Validators.required]],
      level: [null, [Validators.required]],
    });


    this.qrScannerService.code$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(code => {
        this.form.controls.address.setValue(code);
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.currencyId)
      )
      .subscribe(params => {
        this.currencyId = params.currencyId;
        this.form.get('currencyId').setValue(this.currencyId);
      });
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.address)
      )
      .subscribe(params => {
        this.address = params.address;
        this.form.get('address').setValue(this.address);
      });
  }


  clear() {
    this.form.reset();
  }

  submit() {

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const body: AddressCaseCreation = {
      projectId: this.userService.project.id,
      title: formValue.title,
      currencyId: formValue.currencyId,
      address: formValue.address,
      level: formValue.level
    };


    this.isSubmitting = true;
    this.addressCaseApi.createAddressCaseUsingPOST(body)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(resBody => {
      this.router.navigate(['address-case']);
    }, (req) => {
      console.error(req);
      const body = req.error;
      if (body.apiErrorCode == ApiErrorCodeEnum.DUPLICATEDADDRESSCASE) {
        this.message.error('Case already exists');
      }
    });

  }

  qrScan() {
    this.router.navigate(['qr-scan']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currencyId) {
      this.form.get('currencyId').setValue(this.currencyId);
    }
    if (changes.address) {
      this.form.get('address').setValue(this.address);
    }
  }


}
